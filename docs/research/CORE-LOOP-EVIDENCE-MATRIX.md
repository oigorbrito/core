# CORE — Auditoria inicial de evidências do núcleo (2026-10-21)

**Escopo estrito:** loop de execução, despacho de ferramentas, contexto, intervenção, estado de execução e parada. Fora: desktop, daemon, workflow durável, armazenamento distribuído, sandbox do SO, implantação.

## Fontes verificadas e força da evidência

| Fonte primária | Tipo | Achado auditável | O que NÃO conclui |
|---|---|---|---|
| https://arxiv.org/abs/2609.00006 | Auditoria de 11 código-bases | Loops assíncronos especializados, sete subsistemas, 29 padrões | Não demonstra superioridade causal de arquitetura ou linguagem |
| https://arxiv.org/abs/2609.20804 | Ablação, 176 configurações pareadas, quatro modelos | Loop fixo; planejamento, ferramentas e contexto variáveis. Elision antes de resumo tem boa eficiência; planejamento e ferramentas dependem do modelo e orçamento | Não compara loop imperativo vs FSM/event sourcing; não estabelece melhor donor |
| https://github.com/rajshah4/harness-benchmark | Benchmark comunitário entre harnesses inteiros | Mesmo modelo/tarefas/verificadores; tabela publicada: 8/8 para Pi, OpenCode, OpenHands em oito tarefas; Pi usou menos tokens/tempo nesse cenário | Amostra e configurações não isolam mecanismo interno; não é leaderboard definitivo |
| https://github.com/d1-m4ss/harness-benchmark | Benchmark comunitário | Logs JSONL, patches, métricas, verificador e controles de contaminação | Não mede apenas o core; requer replicação |

## Mapa de implementação observável (fontes upstream)

| Motor | Fonte inspecionada / contrato | Evidência localizada | Lacunas de prova |
|---|---|---|---|
| Pi | https://github.com/earendil-works/pi/tree/main/packages/agent/src ; `agent.ts`, `agent-loop.ts` | `Agent` com `prompt`, `steer`, `followUp`, `abort`, `waitForIdle`; execução embutida offline com um `echo` foi reportada PASS no Windows | comparação de scheduling/contexto e robustez sob concorrência/interrupção |
| OpenHands | https://github.com/OpenHands/software-agent-sdk/blob/main/openhands-sdk/openhands/sdk/agent/agent.py | `Agent.step`/`astep`, `_ActionBatch`, `ParallelToolExecutor`, `_aexecute_actions`, tratamento de `FinishTool`, `StreamContext`, integração com `ConversationState` | demonstrar APIs fora da aplicação e medir overhead/semântica comparável |
| OpenCode | https://github.com/anomalyco/opencode/blob/dev/specs/v2/session.md | contrato explicita admissão da mensagem antes da execução e ciclo de entrega via inbox/projeção; é arquitetura de sessão, não necessariamente exigência do core mínimo | localizar runner exato e testes na revisão fixada; não assumir v2 como caminho ativo universal |
| Codex | https://github.com/openai/codex/tree/main/codex-rs/core | core Rust existente | ainda não extraídos detalhes do loop, testes e contratos nesta rodada; NÃO_VERIFICADO |

## Hipóteses do núcleo e ensaios que discriminam

| Questão | Controles idênticos | Métrica | Evidência pública atual |
|---|---|---|---|
| Loop imperativo vs transições explícitas | mesmo modelo simulado, sequência de mensagens/ferramentas, resultados e política | correção da ordem, estados terminais, LOC de adaptação, overhead | NÃO HÁ ablação causal demonstrada nas fontes citadas |
| Sequencial vs paralelo | mesmo lote de ferramentas sem conflitos e com conflitos | tempo, ordem, resultados duplicados e detecção de conflito | API de execução paralela observada no OpenHands; comparação controlada pendente |
| Contexto integral vs elision vs resumo | mesma tarefa e orçamento de tokens | overflow, conclusão, tokens, latência | Evidência experimental no estudo 176; priorizar reproduzir as ablações publicadas antes de inventar novas |
| Planejamento permanente vs opcional | mesma tarefa/modelo e orçamento | sucesso, custo, turns | Evidência experimental no estudo 176: efeito condicionado à capacidade do modelo |
| Interrupt/steer/followup | injeções determinísticas nos limites de turno e durante ferramenta | processamento em ordem, cancelamento, estados de parada | API Pi localizada, execução local não demonstrada |
| Predicado de fim | ferramenta de conclusão vs stop reason vs limiar | falsos positivos/negativos; passos após encerramento | OpenHands utiliza FinishTool; Pi tem stopReason; teste pareado pendente |

## Decisões que as evidências já autorizam

1. **Não criar loop novo antes de teste que exponha incapacidade dos motores existentes.**
2. **Separar mecanismo de loop das estratégias variáveis de planejamento, contexto e ferramentas**, usando configuração/extensão pública quando disponível.
3. **Não antecipar event sourcing, banco de dados ou supervisor** como elementos do núcleo; observar propriedades do motor antes de prescrever arquitetura.
4. Pi segue **baseline executado limitado**; OpenHands é candidato de núcleo com paralelismo e mecanismo de conclusão identificados em fonte; outros permanecem candidatos sem classificação quantitativa.
5. O estudo 176 não prova que um loop específico é vencedor; resultados do benchmark comunitário são de harness completo.

## Próximo teste com máximo poder discriminante e mínimo retrabalho

Comparar **somente Pi e OpenHands inicialmente**, no nível da chamada de `agent.step/astep` ou turno equivalente: entradas sintéticas idênticas, duas ferramentas com e sem dependência, evento de interrupção, mensagem de follow-up e predicado de conclusão. Instrumentar *traces de transições e de chamadas de ferramentas*, não scripts de produto. Reutilizar testes nativos dos dois projetos e evitar alterações no código upstream. Só incluir OpenCode e Codex no ensaio após a auditoria de APIs de loop fixadas por SHA.

Critério: `PASS/FAIL/NOT_RUN` por semântica, custo de integração em linhas de adaptação e eventuais patches internos (objetivo zero), logs originais e SHA do donor. Benchmarks com LLM real são etapa separada para validar as conclusões funcionais, não pré-requisito para diagnóstico de loops.

**Progresso:** este documento é auditoria de fontes; **nenhuma capacidade funcional do CORE foi aceita** e nenhum ensaio novo foi executado neste bloco. Nenhum merge ou refatoração.
