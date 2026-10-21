import { Core } from "../../reference/core.mjs";
import { assertPolicy, assertJournal } from "../contracts.mjs";

// Temporary test-only adapter. A donor can replace it without changing CoreHost.
export function referenceEngine({model, tools = {}, maxSteps = 12, maxObservationBytes = 8192} = {}) {
  return {
    run({task, signal, authorize, journal, onEvent}) {
      return new Core({
        model, tools, authorize: assertPolicy(authorize),
        journal: assertJournal(journal), maxSteps, maxObservationBytes
      }).run({task, signal, onEvent});
    }
  };
}
