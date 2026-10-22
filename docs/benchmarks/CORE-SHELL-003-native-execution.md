# CORE-SHELL-003 — Execução direta, sem modelo (Codex local)

Estado: `READY_FOR_NATIVE_DRIVER_IMPLEMENTATION`. Finalidade única: comparar **as implementações de shell reais** de Pi e Orca, sem LLM, com ambiente e comandos equivalentes. Não confundir este gate com o SWE-bench ou o host Python.

## Fontes verificadas

- Pi `packages/coding-agent/src/core/tools/bash.ts`: `createLocalBashOperations` implementa subprocess, cancelamento, timeout e stdout/stderr mesclados. A API de ferramenta `createBashTool` acrescenta truncamento, formato e políticas.
- Orca `crates/tools/src/core_tools/shell.rs`: `ShellTool::local().call(..., &ToolContext)` implementa subprocess real, cancelamento, timeout, stdout/stderr separados. `Executor::local_sh()` executa `sh -c`.
- Fixar SHAs para ambos (não usar HEAD móvel durante coleta); anotar a diferença entre Pi upstream e FineCode downstream. Executar no **mesmo Linux WSL Ubuntu**, inclusive ambos processos, sobre mesmo filesystem local do WSL (não /mnt/d). Não comparar Pi no Windows com Orca no WSL.

## Gate operacional único — autorizado

1. Preservar modificações locais já existentes. Usar worktrees/diretórios isolados. Reaproveitar donor Orca SHA `4b74788005b081ce97418361f85e97a338c8d433` e Pi 1.3.0 SHA `71023aec1546d6d677a65669c5665c0927ce0dd0` se ainda disponíveis e se as APIs corresponderem; caso contrário registrar commits exatos **antes** das medidas.
2. Implementar dois drivers pequenos sem alterar upstream: TypeScript importando a API `createLocalBashOperations` e Rust usando `ShellTool` e `ToolContext` reais. Para Rust, usar exemplo no donor isolado ou pacote externo com dependências `path`; para Pi, usar driver junto de checkout isolado com resolução de dependências já instaladas. Não medir CLI inicializando nem compilar a cada tentativa.
3. Padronizar shell para `/bin/sh`, cwd, PATH, `LC_ALL=C.UTF-8`, output limitado, limites/cancelamento, prioridade e aquecimento. Se API Pi não permitir shell idêntico, marcar `NON_EQUIVALENT_SHELL` e não agregar. Normalizar stdout+stderr sem presumir preservação de ordem entre pipes diferentes.
4. Cases: comando mínimo `:`, saída `printf`, exit code 7, caminho Unicode+espaços, escrita de arquivo, saída de 128 KB, timeout com filho, cancelamento explícito e concorrência 1/4/16. Todos em diretórios temporários controlados, sem rede. Cada caso deve ter oráculo independente (exit status, conteúdo, hashes, ausência de filhos, arquivos).
5. Executar no mínimo 30 repetições por candidato/caso de latência; alternar AB/BA em 5 ou mais blocos, randomizar pares por semente registrada quando necessário. Coletar wall_ns de relógio monotônico, CPU/RSS se mensurável, bytes/truncamento, estado e stderr. Não excluir falhas nem ultrapassar recursos sem limite.
6. Rodar em três gates **a partir dos mesmos registros brutos**: equivalência e correção, latência/custo por operação correta, cancelamento/concorrência. Registrar versão do SO, compiladores, CPUs, SHA dos drivers e donors, carga concorrente e resultados brutos com SHA256.
7. Concluir com comparações quantitativas e dispersões somente onde a equivalência foi comprovada. Carga de shell não mede eficácia de agente em bug de produção. Proibido declarar Orca vencedor por preferência ou usar métricas do shell hospedeiro como resultado de core. Sem API paga ou merge na main.

## Critério de conclusão

`SHELL_PAIRED_MEASURED`: resultados de **ambos** os drivers reais e oráculos com manifests verificáveis; caso contrário `SHELL_NOT_YET_COMPARABLE` com causa concreta. Não ampliar SWE-bench enquanto esse gate independente estiver em execução.

## Nota de execução

O GitHub Actions #39731701462 executou apenas a baseline do supervisor Python. O trabalho daqui é implementar e executar os drivers reais, **não** repetir aquela baseline.
