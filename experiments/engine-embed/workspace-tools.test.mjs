import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { workspaceTools } from "./workspace-tools.mjs";

async function fixture(fn) {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "core-embed-security-"));
  try { return await fn(root, await workspaceTools(root)); }
  finally { await fs.rm(root, { recursive: true, force: true }); }
}
function pick(tools, name) {
  const tool = tools.find(t => t.name === name);
  assert.ok(tool, `missing ${name}`);
  return (args) => tool.execute("test-call", args);
}

test("traversal and absolute paths are denied for both reads and writes", async () =>
  fixture(async (root, tools) => {
    const read = pick(tools, "read_file"), write = pick(tools, "write_file");
    for (const candidate of ["../escape.txt", "./escape.txt", "/tmp/escape.txt", "a/../escape.txt"]) {
      assert.equal((await read({ path: candidate })).isError, true, candidate);
      assert.equal((await write({ path: candidate, text: "x" })).isError, true, candidate);
    }
    assert.deepEqual(await fs.readdir(root), []);
  }));

test("symlink paths cannot escape the workspace", async (t) =>
  fixture(async (root, tools) => {
    const outside = await fs.mkdtemp(path.join(os.tmpdir(), "core-embed-outside-"));
    try {
      await fs.writeFile(path.join(outside, "secret"), "not reachable");
      try { await fs.symlink(outside, path.join(root, "external"), "dir"); }
      catch (error) {
        if (["EPERM", "EACCES", "ENOSYS"].includes(error.code)) return t.skip("symlink privilege unavailable");
        throw error;
      }
      const read = pick(tools, "read_file"), write = pick(tools, "write_file");
      assert.equal((await read({ path: "external/secret" })).isError, true);
      assert.equal((await write({ path: "external/new", text: "x" })).isError, true);
      await assert.rejects(fs.stat(path.join(outside, "new")), { code: "ENOENT" });
    } finally { await fs.rm(outside, {recursive: true, force: true}); }
  }));

test("write is exclusive and nonunique edits fail without mutation", async () =>
  fixture(async (root, tools) => {
    const write = pick(tools, "write_file"), edit = pick(tools, "replace_exact");
    assert.notEqual((await write({ path: "a.txt", text: "x x" })).isError, true);
    assert.equal((await write({ path: "a.txt", text: "overwrite" })).isError, true);
    assert.equal((await edit({ path: "a.txt", before: "x", after: "y" })).isError, true);
    assert.equal(await fs.readFile(path.join(root, "a.txt"), "utf8"), "x x");
    assert.notEqual((await edit({ path: "a.txt", before: "x x", after: "ok" })).isError, true);
    assert.equal(await fs.readFile(path.join(root, "a.txt"), "utf8"), "ok");
  }));

test("read limit rejects oversized file", async () =>
  fixture(async (root, tools) => {
    await fs.writeFile(path.join(root, "large"), "x".repeat(65537));
    const read = pick(tools, "read_file");
    assert.equal((await read({ path: "large" })).isError, true);
  }));
