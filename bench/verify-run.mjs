import fs from "node:fs/promises";
import path from "node:path";
const required=["schema_version","benchmark_id","task_id","donor","donor_sha","model","model_version","fixture_sha256","environment","started_at","ended_at","status","oracle","metrics","raw_trace_path","validator_path"];
export function verifyRun(r){
 const errors=[];
 if(!r||typeof r!=="object"||Array.isArray(r))return ["NOT_OBJECT"];
 for(const k of required)if(!(k in r))errors.push("MISSING:"+k);
 if(errors.length)return errors;
 if(r.schema_version!==1)errors.push("INVALID_VERSION");
 for(const k of ["benchmark_id","task_id","donor","donor_sha","model","model_version","fixture_sha256","raw_trace_path","validator_path"])
  if(typeof r[k]!=="string"||!r[k].trim())errors.push("INVALID:"+k);
 if(!["PASS","FAIL","TIMEOUT","ERROR","NOT_SUPPORTED"].includes(r.status))errors.push("INVALID:status");
 if(typeof r.environment!=="object"||r.environment===null||Array.isArray(r.environment))errors.push("INVALID:environment");
 if(typeof r.metrics!=="object"||r.metrics===null||Array.isArray(r.metrics))errors.push("INVALID:metrics");
 if(typeof r.oracle!=="object"||r.oracle===null||Array.isArray(r.oracle))errors.push("INVALID:oracle");
 for(const k of ["started_at","ended_at"])if(!Number.isFinite(Date.parse(r[k])))errors.push("INVALID:"+k);
 if(Number.isFinite(Date.parse(r.started_at))&&Number.isFinite(Date.parse(r.ended_at))&&Date.parse(r.ended_at)<Date.parse(r.started_at))errors.push("NEGATIVE_DURATION");
 for(const k of ["raw_trace_path","validator_path"])if(path.isAbsolute(r[k])||r[k].split(/[\\/]/).includes(".."))errors.push("UNSAFE_PATH:"+k);
 return errors;
}
if(process.argv[1]&&import.meta.url===new URL("file://"+path.resolve(process.argv[1])).href){
 const files=process.argv.slice(2);
 if(!files.length){console.error("Usage: node bench/verify-run.mjs <result.json> [...]");process.exitCode=2}
 for(const file of files){
  try{const errors=verifyRun(JSON.parse(await fs.readFile(file,"utf8")));console.log(JSON.stringify({file,valid:errors.length===0,errors}));if(errors.length)process.exitCode=1}
  catch(error){console.error(JSON.stringify({file,valid:false,error:String(error.message)}));process.exitCode=1}
 }
}
