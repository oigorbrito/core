import {test} from "node:test";
import assert from "node:assert/strict";
import {verifyRun} from "../verify-run.mjs";
const sample=()=>({schema_version:1,benchmark_id:"b2",task_id:"fixture-1",donor:"candidate",donor_sha:"012345",model:"fixed-model",model_version:"v1",fixture_sha256:"abc",environment:{os:"windows"},started_at:"2026-10-21T00:00:00Z",ended_at:"2026-10-21T00:01:00Z",status:"FAIL",oracle:{passed:false},metrics:{latency_ms:null},raw_trace_path:"logs/run.jsonl",validator_path:"logs/oracle.txt"});
test("accepts valid metadata without treating FAIL as malformed",()=>assert.deepEqual(verifyRun(sample()),[]));
test("rejects fabricated omissions",()=>{const r=sample();delete r.donor_sha;assert.ok(verifyRun(r).includes("MISSING:donor_sha"))});
test("rejects time reversal",()=>{const r=sample();r.ended_at="2026-10-20T00:00:00Z";assert.ok(verifyRun(r).includes("NEGATIVE_DURATION"))});
test("rejects unsafe evidence path",()=>{const r=sample();r.raw_trace_path="../secret";assert.ok(verifyRun(r).includes("UNSAFE_PATH:raw_trace_path"))});
test("rejects unknown status",()=>{const r=sample();r.status="WINNER";assert.ok(verifyRun(r).includes("INVALID:status"))});
