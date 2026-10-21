// Transparent provider adapter: collects metrics without mutating requests or responses.
// Important: byte counts are NOT token counts; absent provider usage is null, not zero.
import { performance } from "node:perf_hooks";

const numberOrNull = v => typeof v === "number" && Number.isFinite(v) && v >= 0 ? v : null;
const byteLength = v => {
  try { return Buffer.byteLength(JSON.stringify(v) ?? "null", "utf8"); }
  catch { return null; }
};
function readUsage(response) {
  const u = response?.usage;
  if (!u || typeof u !== "object") return {
    input_tokens: null, output_tokens: null, cache_read_tokens: null,
    fresh_input_tokens: null, cost: null
  };
  const input = numberOrNull(u.input_tokens ?? u.inputTokens ?? u.input);
  const output = numberOrNull(u.output_tokens ?? u.outputTokens ?? u.output);
  const cache = numberOrNull(u.input_tokens_details?.cached_tokens ?? u.cacheRead ?? u.cache_read_tokens);
  const cost = numberOrNull(u.cost?.total ?? u.total_cost ?? u.cost);
  return {
    input_tokens: input, output_tokens: output, cache_read_tokens: cache,
    fresh_input_tokens: input !== null && cache !== null && cache <= input ? input - cache : null,
    cost
  };
}
export function instrumentModel(model, { record, modelId = null, taskId = null } = {}) {
  if (!model || typeof model.next !== "function") throw new TypeError("MODEL_NEXT_REQUIRED");
  if (typeof record !== "function") throw new TypeError("RECORD_REQUIRED");
  return {
    async next(request) {
      const start = performance.now();
      let response, failure = null;
      try { response = await model.next(request); return response; }
      catch (error) { failure = error; throw error; }
      finally {
        // Never retain prompt bodies, credentials, model response content or tool arguments.
        const context = request?.history;
        const toolSchemas = request?.tools;
        const usage = readUsage(response);
        const event = {
          schema_version: 1, event: "model_call", model_id: modelId, task_id: taskId,
          status: failure ? "error" : "ok",
          elapsed_ms: performance.now() - start,
          history_bytes: byteLength(context),
          tool_schema_bytes: byteLength(toolSchemas),
          ...usage
        };
        try { await record(event); } catch { /* Metrics never change agent outcome. */ }
      }
    }
  };
}
