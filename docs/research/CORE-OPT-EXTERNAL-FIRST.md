# CORE-OPT-001 — HOLD: evidência externa antes de implementação

**Decisão de governança (2026-10-21):** não implementar, integrar, otimizar ou anunciar ganho do adaptador de contexto até auditar estudos e experimentos externos. O código já adicionado em `optimizations/context/` permanece histórico/experimental, **não autorizado como arquitetura nem funcionalidade aceita**. O pedido do usuário é explícito: **testes externos primeiro, sem implementação**.

## Evidências externas encontradas

| Fonte | Resultado publicado | Qualificação essencial |
|---|---|---|
| [rajshah4/harness-benchmark](https://github.com/rajshah4/harness-benchmark) | Pi, OpenCode, OpenHands: oito tarefas curtas 8/8; diferenças substanciais em tokens/custos | Estudo pequeno, resultados de terceiros, harnesses completos e uma repetição por tarefa na matriz principal |
| [Toolport lazy discovery](https://github.com/btsouth/toolport/blob/main/BENCHMARK.md) | 74–91% menos tokens, 15/15 acertos em ambos os modos por configuração | Benchmark produzido pelo autor do projeto, tarefas limitadas, catálogos de 63–183 ferramentas |
| [Dynamic Tool Discovery](https://vstorm.co/agentic-ai/dynamic-tool-discovery-a-systematic-evaluation-of-8-search-strategies-for-ai-agents/) | Regex: 73% menos tokens, 95% de seleção vs 99% com todas as ferramentas | Demonstra trade-off e possível perda de capacidade |
| [AWS Strands tool-discovery case](https://builder.aws.com/content/3Jq25lA4i23ruCvtZgvJvzFixul/build-tool-discovery-or-buy-agentcore-gateway) | Cerca de 40 ferramentas: todas disponíveis 20/20; BM25 14/20 com ~57% menos tokens | Estudo pequeno, resultado desfavorável ao filtro automático |
| [TSCG](https://arxiv.org/abs/2605.04107) · [código](https://github.com/SKZL-AI/tscg) | Estudos declarados de compactação de schemas, múltiplos modelos e economia dependente do cenário | Inspecionar artefatos, adapters e medição independente; não transferir ganhos ao CORE |
| [Same Model, Different Harness](https://arxiv.org/abs/2608.26218) | Em condições de pressão de contexto, tratamento de histórico/estagnação melhora resultado em tarefas de programação | Não equivale a remoção seletiva de ferramentas nem demonstra melhora universal |

## O que os dados **não** autorizam

- Não implementar lazy discovery por intuição ou porcentagens de redução de tokens isoladas.
- Não declarar ganho por medir bytes de histórico, número de schemas ou chamada de modelo simulada.
- Não escolher algoritmo de seleção de ferramentas antes de verificar que ele mantém acesso à ferramenta necessária.
- Não misturar efeitos de compressão de schemas, roteamento de ferramentas, compactação de resultados e detecção de estagnação numa única mudança: são intervenções distintas.
- Não considerar resultados de desenvolvedores equivalentes a replicações independentes.
- Não atribuir porcentagem, `PASS`, qualidade, desempenho ou segurança do CORE a resultados externos.

## Sequência bloqueante, antes de qualquer novo código

1. Auditar os experimentos externos por: dataset, número de tarefas, repetições, modelo, catálogo de ferramentas, custos/tokens, verificador, erros, controle, acesso a logs e data/versão.
2. Separar impacto sobre **correção end-to-end** de acurácia de **seleção da ferramenta**, volume de tokens e latência; comparar apenas medidas equivalentes.
3. Criar matriz de aplicabilidade: catálogo pequeno/grande, presença de ferramentas críticas, retenção de contexto, fallback e custo de descoberta.
4. Decidir se existe mecanismo externo demonstradamente reutilizável sem refatorar loop, e se é necessário algum teste local novo. Se não houver evidência suficiente, registrar **INDETERMINADO**.
5. Somente mediante decisão sustentada liberar implementação específica e ablação pré-registrada.

**Estado funcional:** 0/5 marcos aceitos. `CORE-OPT-001` está `HOLD_EXTERNAL_EVIDENCE` e nenhuma melhoria de eficiência foi demonstrada.
