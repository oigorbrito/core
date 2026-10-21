use std::sync::{Arc,Mutex,atomic::{AtomicUsize,Ordering}};
use std::collections::HashSet;
use std::time::Instant;
use serde_json::{json,Value};
use orca_harness_core::testing::{ScriptedModel,call};
use orca_harness_core::{Agent,FnTool,Limits};

#[tokio::main]
async fn main(){
 let fanout:usize=std::env::var("CORE_FANOUT").unwrap_or_else(|_|"4".into()).parse().unwrap();
 let reps:usize=std::env::var("CORE_REPS").unwrap_or_else(|_|"30".into()).parse().unwrap();
 let mut rows=Vec::new();
 for i in 0..reps {
  let count=Arc::new(AtomicUsize::new(0));
  let counter=count.clone();
  let seen=Arc::new(Mutex::new(HashSet::<usize>::new()));
  let recorded=seen.clone();
  let tool=FnTool::new("fetch","Return a fixed value",json!({"type":"object","properties":{"source":{"type":"number"}},"required":["source"]}),
   move |input,_ctx|{let c=counter.clone();let recorded=recorded.clone();async move {
    let source=input.get("source").and_then(Value::as_u64).expect("source must be integer") as usize;
    assert!(source<fanout,"out of range source");
    assert!(recorded.lock().unwrap().insert(source),"duplicate source");
    c.fetch_add(1,Ordering::SeqCst);Ok(Value::Null)
   }});
  let calls=(0..fanout).map(|j|call(&format!("c{j}"),"fetch",json!({"source":j}))).collect();
  let agent=Agent::new(ScriptedModel::tool_round(calls,"done"))
    .system_prompt("You are a concurrent fetcher.")
    .tool(tool)
    .limits(Limits {max_parallel_tools:64,..Limits::default()});
  let start=Instant::now();
  let result=agent.run(format!("fetch {fanout} sources").as_str()).await.expect("offline loop failed");
  let elapsed_ms=start.elapsed().as_secs_f64()*1000.0;
  assert_eq!(count.load(Ordering::SeqCst),fanout,"tool executions mismatch");
  let _=result;
  let unique=seen.lock().unwrap().len();
  assert_eq!(unique,fanout,"unique source coverage mismatch");
  rows.push(json!({"candidate":"orca","iteration":i+1,"fanout":fanout,"elapsed_ms":elapsed_ms,"turns":2,"executed":fanout,"uniqueSources":unique,"correct":true}));
 }
 println!("{}",json!({"candidate":"orca","fanout":fanout,"repetitions":reps,"records":rows}));
}
