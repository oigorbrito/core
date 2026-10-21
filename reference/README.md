# Reference contract — not a chosen engine
This is a minimal, dependency-free **test harness**, not a production coding agent and not a claim that JavaScript is the best runtime.

Run with Node.js 22+: `node --test test/core.test.mjs`.

The suite checks 10 behavioral scenarios: model/tool loop, fail-closed authorization, unknown tool, cancellation, step limit, observation limit, tool errors, journal-before-effect, invalid input, and cancelled-but-completed effect. No real models, files, shell, persistence, sandbox, or provider calls.

A journal interface records *intent* before an effect, but **does not** solve uncertain effects, atomicity, crash recovery, idempotence or exactly-once execution. An authorization callback **does not** provide OS-level isolation. No comparative benchmark has been performed.

This contract is provisional. A cloned donor should be assessed against the required behaviors through a public API. **Do not refactor the donor to resemble this contract.** If a design conflict appears, evaluate the contract itself.

Scientific scope: [arXiv:2609.00006v1](https://arxiv.org/html/2609.00006v1) is source-code anatomy (not winner ranking). [arXiv:2608.26218](https://arxiv.org/abs/2608.26218) is a controlled harness-policy experiment; its results do **not** transfer to this code. [arXiv:2605.27922](https://arxiv.org/abs/2605.27922) offers benchmark methodology.

No milestone M1–M5 is accepted from these unit tests. Donor comparison requires fixed tasks, same model, version, tool permissions and budget, independent verification, raw trace, failure accounting and repeated runs.
