# CORE-REUSE-01 — Executable incorporation probe

**Question:** Can an existing engine run one end-to-end tool cycle embedded in our application without the upstream CLI or any paid model?

**Candidate tested:** `@earendil-works/pi-agent-core@1.3.0`, paired with `@earendil-works/pi-ai@1.3.0`, from upstream `earendil-works/pi`. Upstream source revision inspected: `16f5f0af4d85ca583d045ceb5ed6d646fcaf7761`. Package releases are not proven to be identical to that source commit: validate separately before promoting this experiment.

## Run

Requires Node >=22.19, npm and an explicit network-enabled dependency install:

```sh
cd experiments/engine-embed
npm install --ignore-scripts --no-audit --no-fund
npm run smoke
```

The script injects an in-process deterministic mock provider (two responses), a side-effect-free echo tool, a tool authorization hook, and an event subscriber. Assertions exercise one authorized tool call, two model turns, lifecycle closure, and a final agent state. No external model API is called; it does not run shell commands or write project files.

## Scope and limitations

This is an **executable probe, not proof of successful execution** until run and its raw output captured in the target environment. Dependencies were not installed and the script was not executed during this commit. The script is NOT a production agent or the project's chosen architecture.

It does not validate persistence, crash recovery, concurrent tools, steering, sandbox boundaries or unknown external effects; it cannot justify selecting Pi as winner. Investigate corresponding public APIs of OpenHands SDK, Codex, OpenCode, Deep Agents, Mastra, and Mistral Vibe before comparison. Keep exact source SHAs and runnable evidence.

Next substantive gate: run the smoke in an isolated checkout, fix API mismatches only if demonstrated, preserve upstream semantics and compare equivalent integration contracts against other candidates; report pass/fail and raw logs. No merge authorization.
