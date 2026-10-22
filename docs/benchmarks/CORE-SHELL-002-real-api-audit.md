# CORE-SHELL-002 — auditoria de superfícies reais (22/10/2026)

**Estado: SOURCE_AUDITED; NOT_MEASURED.** Referências canônicas do upstream:
- Pi/FineCode: `packages/coding-agent/src/core/tools/bash.ts` e `packages/coding-agent/src/core/bash-executor.ts` em `oigorbrito/FineCode`, com `createLocalBashOperations` / `createBashTool`, abort por `AbortSignal`, `killProcessTree`, e `waitForChildProcess`.
- Orca: `crates/tools/src/core_tools/shell.rs` em `okikorg/orca-harness`, com `ShellTool::local()`, `Tool::call`, `Executor::local_sh()`, `ToolContext`, cancellation token e timeout.

**Não executar `bench/shell/shell_host_baseline.py` como benchmark de um core.** A Action #39731701462 provou somente subprocess Python hospedeiro.

## Diferenças de contrato a normalizar

1. Pi usa `bash` e, na camada de ferramenta, apresenta saída combinada e potencialmente truncada; Orca expõe `stdout`, `stderr`, `exitCode`, `success` separadamente, com limites distintos. Comparar códigos, efeitos e hashes de saída com contratos equivalentes; reportar truncamentos e bytes capturados separadamente.
2. Pi depende de escolha/configuração do shell pelo host (`getShellConfig`), Orca local usa `sh -c`. Fixar ambiente POSIX (`/bin/sh`) para casos portáveis e registrar `bash` quando necessário; comparar Apple-to-Apple. Não contar velocidade de shell diferente como core overhead.
3. Pi `createLocalBashOperations` aceita `AbortSignal`, timeout e onData; Orca `ShellTool::timeout` e `ToolContext.cancellation`. Adaptadores externos devem invocar estas superfícies diretamente sem modelo, sem CLI e sem reimplementação de subprocess.
4. Conferir que `shell` do Orca é `Parallel` por padrão, e que políticas de exclusão de escritas do Pi não sejam tratadas como defeito de throughput. Em concorrência, avaliar segurança e equivalência de política separadamente.

## Regra para execução medida

Fixar SHAs/binários e deps uma vez. Criar dois pequenos drivers nativos: TypeScript importando `createBashTool(...).execute` ou `createLocalBashOperations(...).exec` em versão fixada, e Rust chamando `ShellTool::local().call(..., &ToolContext)` da revisão fixada. Nunca comparar um driver que executa shell por conta própria com o outro que usa o shell do core.

Manifesto por run: `harness`, `donor_sha`, `driver_sha256`, `shell_path`, `case_id`, `trial_id`, `order`, `wall_ns`, `cpu_ms`, `peak_rss_bytes` (null se não medido), `stdout_sha256`, `stderr_sha256` ou saída combinada documentada, `exit_code`, `cancelled`, `timeout`, `filesystem_effects`, `oracle_pass`.

Distribuição de workload: comando muito curto (overhead), saída volumosa (I/O e truncamento), falha exit 7, caminhos/Unicode, processo filho cancelado, limites de tempo, fanout 1/4/16, escrita conflitante. Pré-registro de critério e 30 repetições/candidato com ordem alternada. Três gates só depois de executar os drivers reais: validade semântica, performance, interrupção/concorrência.

**Nenhum resultado superioridade foi produzido por este documento.** A tarefa pendente é construir e executar os drivers, não homologar novamente o supervisor.
