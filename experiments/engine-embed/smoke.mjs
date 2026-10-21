// Executable upstream-engine embedding probe. No paid API, filesystem writes or shell tools.
import assert from "node:assert/strict";
import { Agent } from "@earendil-works/pi-agent-core";
import { createAssistantMessageEventStream } from "@earendil-works/pi-ai/compat";
import { Type } from "typebox";

const observed = [];
const executed = [];
let requests = 0;
let approvals = 0;
const usage = {
  input: 0, output: 0, cacheRead: 0, cacheWrite: 0, totalTokens: 0,
  cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0 },
};
const reply = (content, stopReason) => ({
  role: "assistant", content, api: "openai-responses",
  provider: "openai", model: "mock", usage,
  stopReason, timestamp: Date.now(),
});

const agent = new Agent({
  initialState: {
    systemPrompt: "Execute only explicitly authorized tools.",
    tools: [{
      name: "echo",
      label: "Echo",
      description: "Return an exact value without side effects.",
      parameters: Type.Object({ value: Type.String() }),
      execute: async (_toolCallId, args) => {
        executed.push(args.value);
        return { content: [{ type: "text", text: args.value }], details: {} };
      },
    }],
  },
  toolExecution: "sequential",
  beforeToolCall: async ({ toolCall }) => {
    approvals++;
    return toolCall.name === "echo" ? undefined : { block: true, reason: "not allowed" };
  },
  streamFn: () => {
    requests++;
    const stream = createAssistantMessageEventStream();
    queueMicrotask(() => {
      const msg = requests === 1
        ? reply([{ type: "toolCall", id: "echo-1", name: "echo", arguments: { value: "probe-ok" } }], "toolUse")
        : reply([{ type: "text", text: "completed" }], "stop");
      stream.push({ type: "done", reason: msg.stopReason, message: msg });
    });
    return stream;
  },
});
agent.subscribe((event) => observed.push(event.type));
await agent.prompt("Call the echo tool, then finish.");
await agent.waitForIdle();

assert.deepEqual(executed, ["probe-ok"], "tool must execute exactly once");
assert.equal(approvals, 1, "tool execution must pass policy hook");
assert.equal(requests, 2, "one tool-use response and one final response");
assert.equal(observed.filter((t) => t === "tool_execution_end").length, 1);
assert.equal(observed.at(-1), "agent_end");
const assistant = agent.state.messages.filter((m) => m.role === "assistant");
assert.equal(assistant.at(-1)?.stopReason, "stop");
console.log(JSON.stringify({
  status: "PASS", scenario: "embedded-engine-offline-tool-cycle",
  requests, approvals, executed, eventCount: observed.length,
  upstreamPackage: "@earendil-works/pi-agent-core@1.3.0",
}, null, 2));
