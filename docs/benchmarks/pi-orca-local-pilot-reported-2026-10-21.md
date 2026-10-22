# CORE — piloto Pi × Orca informado pelo executor local (21–22/10/2026)

**Estado:** `LOCAL_REPORTED_NOT_INDEPENDENTLY_AUDITED`. Esta nota reproduz resultados informados pelo executor. Os logs em `D:/projetos/core/oigorbrito-core/docs/benchmarks/results/local-paired-2026-10-21/` não foram disponibilizados a esta sessão nem publicados na branch remota até esta revisão. Portanto **não** promover a `REPRODUZIDO`, `AUDITADO`, `REPLICADO` ou `SUPERIORIDADE_DEMONSTRADA` antes da reconciliação dos arquivos brutos.

## Números reportados

| Métrica | Pi 1.3.0 | Orca 0.9.0 |
|---|---:|---:|
| Acertos | 10/10 | 10/10 |
| Prompt tokens (Ollama) | 50.711 | 41.067 |
| Completion tokens (Ollama) | 2.217 | 1.774 |
| Total tokens (10 tentativas) | 52.928 | 42.841 |
| Tokens por tarefa correta | 5.292,8 | 4.284,1 |
| Tempo total informado por tarefa correta | 503,21 s | 512,67 s |
| Mediana por tentativa | 483,02 s | 522,07 s |

Redução reportada em tokens = `(52928 - 42841)/52928 = 19,06%`. Pi foi `(512,67 - 503,21)/512,67 = 1,85%` mais rápido no tempo total por tarefa reportado; interpretação dependente da definição do campo original e sua reconciliação com a soma dos tempos de todos os trials.

Escopo: duas tarefas **seeded** (`fix-retry-boundary`, `fix-worker-heartbeat`) do donor Orca, 5 trials por tarefa/harness, modelo `gpt-oss:20b` digest `f38aa0c53da5f8c49d08c43a99df24ff53167fe68e24664a7777288e7656fdfe`. Pi upstream `71023aec1546d6d677a65669c5665c0927ce0dd0`; Orca donor `4b74788005b081ce97418361f85e97a338c8d433`; 93 requisições pontuadas informadas via proxy local. Nenhuma cobrança de API informada. Teste runner 8/9, com falha de separador de caminhos Windows relatada; evidência ainda precisa ser inspecionada.

## Condições para aceitar esses números

1. Importar os dados brutos, artefatos e manifesto de SHA-256 para o repositório/artifact sem credenciais nem conteúdo privado.
2. Reconciliar total de chamadas (93), registros por tentativa (20), `prompt_tokens`, `completion_tokens`, timestamps, ordens AB/BA e provas do oracle externo, sem excluir falhas.
3. Comprovar protocolo idêntico de modelos, ferramentas, orçamento e permissões entre agentes e que nenhum golden patch ou resposta esperada foi vazado no contexto. Distinguir preflight (não pontuado) das chamadas pontuadas.
4. Registrar `NÃO_VERIFICADO` para dados faltantes. Não inferir economia financeira a partir de tokens locais.

## Decisão

`PILOT_INCONCLUSIVE`. O dado informado favorece Orca em tokens em duas tarefas seeded; não demonstra superioridade em bugs de produção nem qualidade equivalente fora desse conjunto. Próximo passo: qualificar previamente tarefas de `SWE-bench_Verified` com avaliador oficial e repetir Pi × Orca. A seleção das tarefas e seu custo de execução devem estar documentados antes dos trials.
