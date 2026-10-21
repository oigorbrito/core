# CORE-TRIAGE-01 — Triagem neutra dos núcleos
Data: 2026-10-21. Escopo estrito: loop, estado, ferramentas, contexto, intervenção e conclusão. Este documento não define vencedor.

## Critérios predefinidos
C1: transições e parada; C2: eventos e estado observável; C3: ferramentas, erros, ordem e concorrência; C4: contexto configurável; C5: intervenção e cancelamento; C6: API pública sem fork; C7: testes nativos e provedor mock; C8: custo incremental medido.
Escala de evidência: SOURCE_CONFIRMED (código ou documentação localizada), TESTED (execução observada), NOT_VERIFIED, GAP_CONFIRMED (ausência ou limitação demonstrada). Não atribuir pontos ou pesos arbitrários nem confundir NOT_VERIFIED com ausência.

## Candidatos — evidência e lacuna
| Candidato | Fonte do mecanismo | Evidência localizada | Principal lacuna da auditoria |
|---|---|---|---|
| Pi | https://github.com/earendil-works/pi/tree/main/packages/agent/src | API Agent/prompt/steer/followUp/abort; smoke mock com echo reportado PASS no Windows para versão publicada 1.3.0 | Sem testes equivalentes de cancelamento/concorrência e sem prova de vitória |
| OpenHands SDK | https://github.com/OpenHands/software-agent-sdk/blob/main/openhands-sdk/openhands/sdk/agent/agent.py ; https://github.com/OpenHands/software-agent-sdk/blob/main/examples/01_standalone_sdk/45_parallel_tool_execution.py | Agent/Conversation/Tool, step e exemplo com tool_concurrency_limit | Simulação comparável, cancelamento, custo de incorporação |
| OpenCode | https://github.com/anomalyco/opencode/blob/dev/packages/core/src/session.ts ; https://github.com/anomalyco/opencode/blob/dev/packages/core/src/session/prompt.ts | Core usa Effect, Session.prompt, eventos, inbox e delivery steer | Determinar fluxo ativo do loop, dependências de extração e suíte |
| Codex | https://github.com/openai/codex/tree/main/codex-rs/core | Crate de núcleo Rust identificada | Inspeção dos pontos de entrada do loop, testes e APIs externas ainda pendente |
| Deep Agents | https://github.com/langchain-ai/deepagents/blob/main/libs/ARCHITECTURE.md | Middleware acima do loop LangChain; não introduz runtime novo | Avaliar o runtime efetivo e custo de remover harness extra |
| Mistral Vibe | https://github.com/mistralai/mistral-vibe/blob/main/AGENTS.md | Índice aponta ADR de loop orientado a eventos e contratos de ferramentas | Confirmar código ativo e APIs de incorporação |
| Mastra | https://github.com/mastra-ai/mastra/blob/main/packages/core/src/loop/workflows/agentic-execution/llm-execution-step.ts | Core expõe implementação de passo LLM e ferramentas | API pública, overhead e controle de resultados de ferramenta |

Uma variante TypeScript de Deep Agents existe em https://github.com/langchain-ai/deepagentsjs ; não contar automaticamente como arquitetura independente.

## Protocolo de triagem e seleção
Fase A: para todos os sete, fixar SHA e registrar código de C1–C7, testes, dependências e interface pública. Não excluir por linguagem, familiaridade ou ausência temporária de dado.
Fase B: reaproveitar testes nativos e comparar com provedor determinístico as mesmas transições, chamadas seriadas e concorrentes, conflito, intervenção, cancelamento e condição de fim. Capturar traces e saídas brutas.
Fase C: medir LOC de adaptadores, patches upstream (alvo zero), serviços obrigatórios, setup, latência e RSS. Só então justificar finalistas e seleção ou necessidade de compor mecanismos.

Sem atribuir ao Pi qualquer vantagem por ser a primeira biblioteca testada. Sucesso de um smoke prova apenas viabilidade daquela configuração.
Esta entrega é pesquisa de código, não ensaio executado; não altera o indicador funcional 0/5. Sem merge e sem modificação de main.

## Pesquisa de referência
https://arxiv.org/abs/2609.00006 — auditoria de código, não prova causal da melhor arquitetura.
https://arxiv.org/abs/2609.20804 — ablações de configuração com loop fixo, não compara arquiteturas de loop.
