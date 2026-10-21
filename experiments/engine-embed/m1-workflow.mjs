import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { Agent } from "@earendil-works/pi-agent-core";
import { createAssistantMessageEventStream } from "@earendil-works/pi-ai/compat";
import { workspaceTools } from "./workspace-tools.mjs";

const root = await fs.mkdtemp(path.join(os.tmpdir(), "core-m1-"));
const events = [];
const executions = [];
let requests = 0;
let approvals = 0;
const usage = { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, totalTokens: 0,
  cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0 } };
function assistant(content, stopReason) {
  return { role: "assistant", content, api: "openai-responses", provider: "openai",
    model: "offline", usage, stopReason, timestamp: Date.now() };
}
const steps = [
  { name: "read_file", args: { path: "app.txt" } },
  { name: "replace_exact", args: { path: "app.txt", before: "wrong", after: "correct" } },
  { name: "read_file", args: { path: "app.txt" } },
];
try {
  await fs.writeFile(path.join(root, "app.txt"), "result=wrong\n");
  const tools = await workspaceTools(root);
  const agent = new Agent({
    initialState: { systemPrompt: "Offline tool execution", tools },
    toolExecution: "sequential",
    beforeToolCall: async ({ toolCall }) => {
      approvals++;
      return tools.some(t => t.name === toolCall.name)
        ? undefined : { block: true, reason: "Tool not registered" };
    },
    streamFn: () => {
      const request = requests++;
      const stream = createAssistantMessageEventStream();
      queueMicrotask(() => {
        const step = steps[request];
        const reply = step
          ? assistant([{ type: "toolCall", id: `m1-${request}`, name: step.name, arguments: step.args }], "toolUse")
          : assistant([{ type: "text", text: "Task complete" }], "stop");
        stream.push({ type: "done", reason: reply.stopReason, message: reply });
      });
      return stream;
    },
  });
  agent.subscribe(event => {
    events.push(event.type);
    if (event.type === "tool_execution_end") executions.push(event.toolName ?? "completed");
  });
  await agent.prompt("Inspect app.txt and replace wrong with correct.");
  await agent.waitForIdle();
  assert.equal(await fs.readFile(path.join(root, "app.txt"), "utf8"), "result=correct\n");
  assert.equal(requests, 4);
  assert.equal(approvals, 3);
  assert.equal(executions.length, 3);
  assert.equal(events.at(-1), "agent_end");
  const read = tools.find(t => t.name === "read_file");
  const denied = await read.execute("deny", { path: "../out-of-workspace.txt" });
  assert.equal(denied.isError, true);
  const write = tools.find(t => t.name === "write_file");
  const created = await write.execute("create", { path: "created.txt", text: "ok\n" });
  assert.equal(created.isError, undefined);
  const duplicate = await write.execute("duplicate", { path: "created.txt", text: "overwrite" });
  assert.equal(duplicate.isError, true);
  assert.equal(await fs.readFile(path.join(root, "created.txt"), "utf8"), "ok\n");
  console.log(JSON.stringify({ status: "PASS", scenario: "m1-offline-file-workflow",
    providerRequests: requests, approvedTools: approvals, executedTools: executions.length,
    events: events.length, pathEscapeDenied: true, overwriteDenied: true,
    checkedContents: "result=correct" }, null, 2));
} finally {
  await fs.rm(root, { recursive: true, force: true });
}
