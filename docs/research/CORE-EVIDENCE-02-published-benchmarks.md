# CORE-EVIDENCE-02 — Dados publicados, inferências e decisões revogáveis
Data da revisão: 2026-10-21. Escopo: somente núcleo de agente. Nenhum benchmark novo foi executado por este documento.

## Fontes primárias
- R1 https://github.com/rajshah4/harness-benchmark — GLM-5.2, oito tarefas curtas, dois projetos médios; harnesses completos (Pi, OpenCode, OpenHands).
- R2 https://github.com/d1-m4ss/harness-benchmark/blob/main/RESULTS.md — dois conjuntos de tarefas, modelo fixado por série, três execuções para GPT, duas para regressão Muse; harnesses completos.
- R3 https://arxiv.org/abs/2609.20804 — 176 configurações pareadas em quatro modelos, loop fixo; variações de contexto, planejamento e ferramentas.
- R4 https://arxiv.org/abs/2609.00006 — análise estática de 11 harnesses, catálogo de padrões; sem ranking causal.

## Dados publicados sem normalizações enganosas
| Série | Candidato | Correção | Input tokens | Tempo (s) | Modelo/tipo |
|---|---|---|---:|---:|---|
| R1 oito curtas | Pi | 8/8 | 573137 | 678.0 | GLM-5.2; soma publicada |
| R1 oito curtas | OpenCode | 8/8 | 1233824 | 838.6 | GLM-5.2; soma publicada |
| R1 oito curtas | OpenHands | 8/8 | 3028731 | 1140.8 | GLM-5.2; soma publicada |
| R1 dois médios | Pi | 2/2 | 537834 | 382 | GLM-5.2; soma publicada |
| R1 dois médios | OpenCode | 2/2 | 1270896 | 738 | GLM-5.2; soma publicada |
| R1 dois médios | OpenHands | 1/2 | 2167646 | 782 | GLM-5.2; soma publicada |
| R2 GPT coding | Codex | 3/3 | 505400 | 107.73 | GPT-5.6 Luna; mediana |
| R2 GPT coding | Pi | 3/3 | 525400 | 140.96 | GPT-5.6 Luna; mediana |
| R2 GPT coding | OpenCode stable | 3/3 | 1797100 | 274.43 | GPT-5.6 Luna; mediana |
| R2 GPT coding | OpenCode beta | 3/3 | >=1015400 | 402.75 | GPT-5.6 Luna; tokens dos subagentes incompletos |
| R2 Muse regression | Pi | 2/2 | 267400 | 103.96 | Muse Spark 1.2; média n=2 |
| R2 Muse regression | Codex | 2/2 | 446400 | 110.42 | Muse Spark 1.2; média n=2 |
| R2 Muse regression | Claude Code | 2/2 | 444200 | 112.46 | Muse Spark 1.2; média n=2 |

Ratios (R1, curtas): OpenCode/Pi tokens = 2.15x, OpenHands/Pi = 5.28x; tempos = 1.24x e 1.68x, respectivamente. Correção equivalente nessas oito tarefas; não demonstram diferença estatística em confiabilidade.
R2 GPT coding: Codex é ~1.31x mais rápido que Pi para a tarefa nas medianas publicadas; não implica superioridade universal. R2 Muse regression: Pi usa ~40.1% menos tokens totais que Codex, com 2/2 para ambos; n=2.

## Matriz de inferência (NÃO confundir com ranking)
| Decisão do CORE | Suporte | Estado |
|---|---|---|
| Manter observáveis por turno: custo de tokens, chamadas, tempo, ferramentas e sucesso | R1 e R2 exibem variação substancial com modelos fixos | SUSTENTADO como requisito de mensuração |
| Permitir reduzir e selecionar schema/conjunto de ferramentas por turno | R1 associa parte da diferença à quantidade de ferramentas; R3 mostra efeitos condicionais de bash-only vs tools especializados | SUSTENTADO como ponto de variação; ganho concreto a medir |
| Expor políticas de contexto dependentes de orçamento e modelo, separadas do loop | R3: contexto importa mais sob orçamento curto; elision antes de sumarização melhora eficiência | SUSTENTADO em domínio estudado; não impor algoritmo como universal |
| Permitir planejamento opcional/adaptativo | R3: planejamento funciona como auxílio de precisão para modelos fracos e redutor de custo para modelos fortes | SUSTENTADO como configurabilidade; adaptação automática não comprovada |
| Selecionar Pi como arquitetura definitiva | R1/R2 contradizem vencedor universal (Codex foi mais rápido em GPT coding) | NÃO_SUSTENTADO |
| Selecionar OpenHands, Codex ou OpenCode como arquitetura definitiva | Nenhuma evidência controlada no nível de core isolado para todos | NÃO_SUSTENTADO |
| Criar FSM/event sourcing/novo loop, supervisor ou workflow durável no CORE | R3 fixa loop; R4 apenas observa padrões | NÃO_SUSTENTADO por esses estudos |
| Exigir paralelismo do loop sempre | nenhuma ablação identificada nestas fontes | NÃO_VERIFICADO |

## Limitações explícitas
R1 mede harnesses completos, inclui diferenças de prompts e contratos de ferramentas; tamanho e distribuição de amostra limitam generalização. R2 é benchmark comunitário em uma base fixada, n=2–3 para tarefas citadas; configurações de uso real e parte da contabilização de subagentes dificultam inferência causal. R3 varia componentes com loop fixo, portanto não estabelece melhor arquitetura de loop. R4 é inspeção de código e não teste de desempenho. Os números não são comparáveis diretamente entre R1 e R2 (modelos, tarefas, medidas e agregações diferentes). Nenhum candidato ganha vaga fixa; falta avaliação conjunta do conjunto completo.

## Próxima decisão verificável
Primeiro, traduzir resultados R3 em interfaces de variação de contexto, action space e planejamento, procurando a implementação existente de cada candidato sem escrever um loop novo. Segundo, reutilizar as tarefas e verificadores R1/R2 e estabelecer testes de equivalência dos mecanismos do core. Terceiro, só discutir winner após medidas de correção, custo, overhead e custo de adaptação por candidata. Não duplicar experimentos já executados sem razão metodológica.

**Estado:** evidência secundária auditada em fontes primárias públicas; NÃO são medições executadas no CORE. Não alterar M1–M5 ou registrar PASS de teste novo.
