import { test } from "node:test";
import assert from "node:assert/strict";
import { instrumentModel } from "../instrument-model.mjs";

test("forwards exact request object and original response", async () => {
 const request={history:[{content:"secret"}],tools:[{name:"search"}]};
 const response={kind:"final",text:"ok",usage:{input_tokens:100,output_tokens:12,input_tokens_details:{cached_tokens:40}}};
 const observed=[];
 const wrapped=instrumentModel({next:async x=>{assert.equal(x,request);return response;}},{record:async e=>observed.push(e),taskId:"fixture"});
 assert.equal(await wrapped.next(request),response);
 assert.equal(observed.length,1);
 assert.equal(observed[0].fresh_input_tokens,60);
 assert.ok(observed[0].tool_schema_bytes>0);
 assert.equal(JSON.stringify(observed).includes("secret"),false);
});
test("missing telemetry remains unknown, not fabricated zero",async()=>{
 const events=[];
 await instrumentModel({next:async()=>({kind:"final",text:"done"})},{record:e=>events.push(e)}).next({});
 for(const key of ["input_tokens","output_tokens","cache_read_tokens","fresh_input_tokens","cost"])assert.equal(events[0][key],null);
});
test("provider errors propagate and produce error metric",async()=>{
 const events=[];
 await assert.rejects(instrumentModel({next:async()=>{throw Error("provider down")}},{record:e=>events.push(e)}).next({}),/provider down/);
 assert.equal(events[0].status,"error");assert.equal(events[0].input_tokens,null);
});
test("metrics sink failures cannot change successful provider response",async()=>{
 const reply={kind:"final",text:"ok"};
 const result=await instrumentModel({next:async()=>reply},{record:async()=>{throw Error("sink")}}).next({});
 assert.equal(result,reply);
});
test("invalid inputs fail closed",()=>{
 assert.throws(()=>instrumentModel({}, {record:()=>{}}),/MODEL_NEXT_REQUIRED/);
 assert.throws(()=>instrumentModel({next:()=>{}},{}),/RECORD_REQUIRED/);
});
