import fs from "node:fs/promises";
import path from "node:path";
import { Type } from "typebox";

// This is path confinement, NOT an operating-system sandbox.
// All file effects run through these tools; no arbitrary shell is exposed.
export async function workspaceTools(root) {
  const base = await fs.realpath(root);
  async function target(relative, { forWrite = false } = {}) {
    if (typeof relative !== "string" || !relative || path.isAbsolute(relative) ||
        relative.split(/[\\/]+/).some(x => x === ".." || x === "." || x === "")) {
      throw new Error("PATH_DENIED: invalid relative path");
    }
    const candidate = path.resolve(base, relative);
    if (candidate !== base && !candidate.startsWith(base + path.sep)) throw new Error("PATH_DENIED: outside workspace");
    // Reject symlinked parents and targets; lstat each existing component, not just realpath on target.
    let cursor = base;
    for (const segment of path.relative(base, candidate).split(path.sep)) {
      cursor = path.join(cursor, segment);
      try {
        const stat = await fs.lstat(cursor);
        if (stat.isSymbolicLink()) throw new Error("PATH_DENIED: symbolic link");
      } catch (error) {
        if (error.code !== "ENOENT") throw error;
        if (!forWrite) throw error;
      }
    }
    return candidate;
  }
  function tool(name, description, parameters, action) {
    return {
      name, label: name, description, parameters,
      executionMode: "sequential",
      execute: async (_id, args) => {
        try {
          const value = await action(args);
          return { content: [{ type: "text", text: JSON.stringify(value) }], details: value };
        } catch (error) {
          const value = { ok: false, error: String(error.message ?? error) };
          return { content: [{ type: "text", text: JSON.stringify(value) }], details: value, isError: true };
        }
      },
    };
  }
  return [
    tool("read_file", "Read a UTF-8 file inside workspace (up to 64 KiB)", Type.Object({ path: Type.String() }), async a => {
      const p = await target(a.path);
      const info = await fs.stat(p);
      if (!info.isFile() || info.size > 65536) throw new Error("READ_LIMIT");
      return { ok: true, path: a.path, content: await fs.readFile(p, "utf8") };
    }),
    tool("write_file", "Write UTF-8 text to a workspace file", Type.Object({ path: Type.String(), text: Type.String({ maxLength: 65536 }) }), async a => {
      const p = await target(a.path, { forWrite: true });
      const parent = await fs.realpath(path.dirname(p)); // parent must already exist
      if (parent !== base && !parent.startsWith(base + path.sep)) throw new Error("PATH_DENIED: parent");
      await fs.writeFile(p, a.text, { encoding: "utf8", flag: "wx" }); // create only, no implicit overwrite
      return { ok: true, path: a.path, bytes: Buffer.byteLength(a.text) };
    }),
    tool("replace_exact", "Replace one unambiguous occurrence in a workspace UTF-8 file", Type.Object({ path: Type.String(), before: Type.String(), after: Type.String() }), async a => {
      if (!a.before || a.after.length > 65536) throw new Error("EDIT_LIMIT");
      const p = await target(a.path);
      const before = await fs.readFile(p, "utf8");
      if (before.length > 65536) throw new Error("EDIT_LIMIT");
      const first = before.indexOf(a.before);
      if (first < 0 || before.indexOf(a.before, first + a.before.length) >= 0) throw new Error("EDIT_NON_UNIQUE");
      const stat = await fs.lstat(p);
      if (!stat.isFile() || stat.isSymbolicLink()) throw new Error("PATH_DENIED");
      // Re-check content to detect some external interference; does not guarantee atomic CAS.
      if (await fs.readFile(p, "utf8") !== before) throw new Error("EDIT_CONFLICT");
      await fs.writeFile(p, before.slice(0, first) + a.after + before.slice(first + a.before.length), "utf8");
      return { ok: true, path: a.path, replacements: 1 };
    }),
  ];
}
