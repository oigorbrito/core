#!/usr/bin/env python3
"""Shell contract oracle: subprocess execution only, NOT a Pi-vs-Orca result."""
import json, os, pathlib, subprocess, sys, tempfile, time

def run_case(args, cwd, timeout=5):
    start=time.perf_counter_ns()
    try:
        p=subprocess.run(args,cwd=cwd,shell=False,capture_output=True,text=True,
                         encoding="utf-8",errors="replace",timeout=timeout)
        return {"status":"completed","code":p.returncode,"stdout":p.stdout,
                "stderr":p.stderr,"elapsed_ms":(time.perf_counter_ns()-start)/1e6}
    except subprocess.TimeoutExpired:
        return {"status":"timeout","code":None,"stdout":None,"stderr":None,
                "elapsed_ms":(time.perf_counter_ns()-start)/1e6}

def assess():
    with tempfile.TemporaryDirectory(prefix="core-shell-contract-") as temp:
        root=pathlib.Path(temp)
        tasks=[
            ("stdout_stderr",["-c","import sys;print('ok');print('warning',file=sys.stderr)"]),
            ("nonzero_exit",["-c","import sys;sys.exit(7)"]),
            ("unicode_path",["-c","from pathlib import Path;Path('ação com espaço.txt').write_text('áλ');print(Path('ação com espaço.txt').read_text())"]),
            ("argv_no_injection",["-c","import sys;print(sys.argv[1])","hello; echo INJECTED"]),
            ("timeout",["-c","import time;time.sleep(5)"])]
        records=[]
        for name,args in tasks:
            result=run_case([sys.executable,*args],root,0.3 if name=="timeout" else 5)
            passed={
               "stdout_stderr":lambda r:r["status"]=="completed" and r["stdout"]=="ok\n" and r["stderr"]=="warning\n" and r["code"]==0,
               "nonzero_exit":lambda r:r["status"]=="completed" and r["code"]==7,
               "unicode_path":lambda r:r["stdout"]=="áλ\n" and (root/"ação com espaço.txt").read_text()=="áλ",
               "argv_no_injection":lambda r:r["stdout"]=="hello; echo INJECTED\n" and r["code"]==0,
               "timeout":lambda r:r["status"]=="timeout" and r["elapsed_ms"] < 1500
            }[name](result)
            records.append({"case":name,"passed":passed,**result})
        return {"schema_version":1,"scope":"HOST_PYTHON_SHELL_BASELINE_NOT_CORE_COMPARISON",
                "platform":sys.platform,"python":sys.version.split()[0],
                "records":records,"passed":all(r["passed"] for r in records)}
if __name__=="__main__":
    result=assess()
    print(json.dumps(result,ensure_ascii=False,indent=2))
    raise SystemExit(0 if result["passed"] else 1)
