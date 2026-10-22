# CORE-DECISION-001 — Seleção empírica de base Pi × Orca

**Objetivo:** decidir qual projeto vale utilizar como base, não validar que o Orca funciona. Status: `PLAN_PRE_REGISTERED`, medições ainda pendentes. Evidência exploratória não pode ser promovida retroativamente a confirmação.

## Candidatos e separação obrigatória

1. Pi 1.3.0 upstream, SHA `71023aec1546d6d677a65669c5665c0927ce0dd0`.
2. Orca 0.9.0 upstream, SHA `4b74788005b081ce97418361f85e97a338c8d433`: falha de reap observada, registrada como desvantagem original.
3. Orca experimental corrigido, base acima + commit de fix `ea30460ddb133476e5c9aeb488ad998fff7ca4a2`, identificado separadamente; não chamar de 0.9.0 original.

Confirmar os SHAs instalados antes dos trials. Não tratar FineCode downstream como idêntico ao Pi upstream. Preservar estado sujo do donor, sem reset.

## Gates que podem mudar decisão (ordem de custo crescente)

**D0 — Integridade/isolamento:** runners e oráculos reproduzíveis; ambiente operacional sem inferência concorrente relevante. Reutilizar CORE-SHELL-003/004; checar gate monitorado uma vez antes da coleta, registrar critérios. Se bloqueado, não ampliar amostragem poluída.

**D1 — Ferramentas reais sem LLM:** shell direto Pi × Orca original × Orca corrigido, mesmo Linux, shell/cwd/processo e limites. Priorizar mediana, p95, RAM/CPU e custo por operação correta em 1/4/16 concorrências, 30 repetições por caso/candidato, 6 blocos AB/BA. Critério de confiabilidade é eliminatório: não esconder reap do original. Usar o original apenas onde seguro; não correr timeout defeituoso sem isolamento.

**D2 — Agent-loop sem inferência cara:** reproduzir microbenchmarks determinísticos existentes sob a mesma infraestrutura, usando modelo scripted idêntico e ferramentas com efeitos reais. Quantificar overhead por etapa (não apresentar como velocidade end-to-end).

**D3 — Eficácia/custo em tarefas:** reciclar piloto local fixado gpt-oss:20b como exploração; exigir tarefas novas pré-registradas, oráculos externos e modelos/limites/transportes *idênticos* para confirmação. Bench SWE-bench real com modelo local inviável pode ser marcado `MODEL_HARDWARE_BLOCKED`, não tornar shell irrelevante e não obrigar repetição infinita. Escolher amostra por critérios de dificuldade e classes de tarefa antes de observar saídas; medir resolução por orçamento, tokens por tarefa correta e tempo total. Falhas e timeouts contam no denominador de eficácia. Caso modelo não faça tool calling ou CPU offload inviabilize orçamento, **não concluir eficácia end-to-end**.

**D4 — Adoção como projeto integral:** matriz reproduzível de auth/provedores, TUI, extensibilidade, manutenção, testabilidade e distribuição. Separar features existentes de trabalho estimado para parity. Comparar o produto utilizável, não só o loop.

## Regras de análise e decisão

- Nenhuma pontuação global com pesos arbitrários. Comparar Pareto e critérios obrigatórios: confiabilidade do executor; capacidade de executar workflow real; permissões/segurança; custo operacional suportável.
- Para tempo/tokens, reportar estimador pareado, variabilidade e intervalos; declarar vantagem somente se robusta em mais de uma classe de tarefa, sem regressão eliminatória de eficácia.
- Toda célula: `PASS`, `FAIL`, `BLOCKED`, `NOT_TESTED`, `DIAGNOSTIC`; nunca converter `BLOCKED` em empate.
- Se Orca corrigido vencer eficiência, descrever o custo de manutenção do patch. Se original falhar confiabilidade, isso é evidência negativa real.
- Parar quando evidência discriminar candidatos ou quando próximo teste exija recurso indisponível: publicar `ORCA_PREFERRED`, `PI_PREFERRED`, `TRADEOFF` ou `INCONCLUSIVE`, **com escopo da afirmação**.
- Capturar logs brutos/hashes, versão do SO, SHAs de drivers, tempos, consumo, oráculos e critérios de exclusão.

## Próxima implementação, sem novos protocolos

No checkout local já existem `bench/shell/pi_native_driver.mjs`, `bench/shell/orca-native-driver/src/main.rs`, `bench/shell/run_native_shell_bench.py`, `bench/shell/analyze_native_shell_bench.py` e correção Orca isolada. Não recriar. Primeiro validar gate de interferência, depois D1 controlado, consolidar imediatamente D1 com microbenchmarks já produzidos e concluir parecer parcial. Só ampliar D3 se hardware/modelo permitirem teste de eficácia genuíno.

Nenhuma chamada paga, merge automático ou escrita na main.
