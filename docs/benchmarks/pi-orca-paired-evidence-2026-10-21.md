# Pi vs Orca — paired core benchmark, evidence summary

Date: 2026-10-21. Source: [GitHub Actions 39676883531](https://github.com/oigorbrito/core/actions/runs/39676883531), commit `6c51519741059f332e3e3e8877969435f022f247`. Three parallel comparisons; 30 repetitions per candidate per fanout and scenario; model scripted offline, no paid inference.

## Normal scenario

| fanout | Pi median loop ms | Orca median loop ms | Pi serialized context bytes | Orca serialized context bytes |
|---:|---:|---:|---:|---:|
| 1 | 0.29989 | 0.00281 | 1233 | 379 |
| 4 | 0.34926 | 0.03975 | 1956 | 739 |
| 16 | 0.49245 | 0.04760 | 4868 | 2199 |

## Injected tool error

| fanout | Pi median loop ms | Orca median loop ms | Pi serialized context bytes | Orca serialized context bytes |
|---:|---:|---:|---:|---:|
| 1 | 0.32413 | 0.00329 | 1249 | 407 |
| 4 | 0.38131 | 0.04090 | 1972 | 767 |
| 16 | 0.53953 | 0.04818 | 4884 | 2227 |

All six cases passed deterministic tool execution and failure-propagation assertions. Results are implementation- and runner-dependent microbenchmarks, not whole coding-task outcomes.

## Interpretation safeguards

- **Loop timing**: includes the agent and scripted tool execution path but excludes LLM inference, network latency, disk I/O, and real programming tasks.
- **Context bytes**: number of UTF-8 bytes after JSON serialization of model-observed internal context. Pi and Orca use different message representations. This is **not** a controlled prompt-wire comparison and **not** token consumption.
- **Correctness**: scripted tool execution passed; no software engineering task-success rate was determined.
- **Economics**: price or tokens per correct task remain **unmeasured**. It would be unsound to declare Orca more economical from the present evidence.
- **Reproducibility**: Pi agent and AI packages pinned at 1.3.0; Orca upstream revision is included in the run artifact. The workflow currently clones Orca from moving upstream HEAD, so cross-run results need the recorded SHA or a pinned SHA to be strictly comparable.
- **Decision**: Orca shows lower scripted core latency; neither core is the established best performer for real coding tasks until matched model-facing payloads and identical successful end-to-end workloads are compared.

## Next evidence gate (not yet executed)

Use one fixed locally capable tool-calling model and identical tool declaration, system message, task prompts and resource budget. Capture requests at the model adapter boundary and record prompt/completion tokens as reported by the same inference backend. Validate task correctness with external tests. Compare paired correct-task rate, elapsed time, calls/turns and tokens **per correct task**. If either candidate cannot complete the tool-calling contract, label that pairing ineligible rather than conflating model weakness with core inefficiency.
