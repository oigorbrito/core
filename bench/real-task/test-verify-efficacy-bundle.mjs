import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {verifyDirectory} from './verify-efficacy-bundle.mjs';
const sha='a'.repeat(64);
const common={task_id:'x',model_digest:sha,fixture_sha256:sha,oracle_sha256:sha,endpoint:'http://127.0.0.1:11434',status:'completed',oracle_correct:true,wall_ms:10,usage:{prompt_tokens:10,completion_tokens:2}};
const metadataCommon={task_id:'x',repeat:0,model_id:'m',model_digest:sha,context_tokens:4096,output_tokens_limit:1024,temperature:0,thinking:'off',tool_schema_sha256:sha,system_prompt_sha256:sha,step_limit:12,deadline_ms:20000,transport:'ollama',oracle_id:'oracle',oracle_version:'1',tool_choice:'auto',exit_status:'completed',oracle_pass:true,usage:{input:10,output:2}};
function withDir(fn){const dir=fs.mkdtempSync(path.join(os.tmpdir(),'core-bundle-'));try{return fn(dir)}finally{fs.rmSync(dir,{recursive:true,force:true})}}
function populate(dir,meta=true){for(const harness of ['pi','orca'])fs.writeFileSync(path.join(dir,`${harness}.json`),JSON.stringify({...common,trial_id:0,harness}));if(meta)fs.writeFileSync(path.join(dir,'parity-metadata.json'),JSON.stringify({trials:['pi','orca'].map(core=>({...metadataCommon,core}))}))}
test('reject empty',()=>withDir(d=>assert.equal(verifyDirectory(d).reason,'EMPTY_DATASET')));
test('reject missing parity metadata',()=>withDir(d=>{populate(d,false);assert.equal(verifyDirectory(d).reason,'PARITY_METADATA_MISSING')}));
test('accept explicitly paired and equal metadata',()=>withDir(d=>{populate(d);assert.equal(verifyDirectory(d).eligible,true)}));
test('reject different output budget',()=>withDir(d=>{populate(d);const f=path.join(d,'parity-metadata.json');const m=JSON.parse(fs.readFileSync(f));m.trials[1].output_tokens_limit=1;fs.writeFileSync(f,JSON.stringify(m));assert.equal(verifyDirectory(d).eligible,false)}));
test('reject mismatched original task/oracle',()=>withDir(d=>{populate(d);const f=path.join(d,'orca.json');const v=JSON.parse(fs.readFileSync(f));v.oracle_sha256='b'.repeat(64);fs.writeFileSync(f,JSON.stringify(v));assert.equal(verifyDirectory(d).eligible,false)}));
test('reject source id absent from parity file',()=>withDir(d=>{populate(d);const f=path.join(d,'orca.json');const v=JSON.parse(fs.readFileSync(f));v.trial_id=1;fs.writeFileSync(f,JSON.stringify(v));assert.equal(verifyDirectory(d).eligible,false)}));
