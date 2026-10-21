# CORE-BENCH-001 — protocolo de reprodução antes de seleção do motor

Data de referência: 2026-10-21. **Status: protocolo preparado, nenhuma comparação executada.**

## Evidências primárias verificadas

| Fonte | Natureza | Resultado/alcance | Restrição de inferência |
|---|---|---|---|
| [Harness Engineering](https://arxiv.org/html/2609.00006v1) | auditoria de 11 sistemas, 7 subsistemas, 29 padrões | inventário arquitetural | **não** é benchmark de superioridade |
| [Same Model, Different Harness](https://arxiv.org/abs/2608.26218) | comparação controlada de políticas | em 169 tarefas Verified com janela de 20.480 tokens e limite de 480 s, F2PF de 28% para 49%, soluções completas de 43 para 72 | não demonstra que um donor específico ou linguagem seja melhor |
| [Harness-Bench](https://arxiv.org/abs/2605.27922) / [código](https://github.com/Qihoo360/harness-bench) | comparação modelo×harness por oráculos em tarefas isoladas | resumo da versão de artigo: 106 tarefas offline, 5.194 trajetórias | verificar versão e conjunto de tarefas do código antes de confrontar números; site vivo pode indicar coleção maior |
| [HarnessSecurity-Bench](https://arxiv.org/abs/2610.07639) | segurança×utilidade | estudo relata 23 tarefas, 2.500 ensaios; auto-approve aumenta sucesso de ataque de 29,2% a 95,6% na condição descrita | contexto do estudo específico; não dispensa ensaio de isolamento local |
| [mini-swe-harness](https://github.com/Salem532/mini-swe-harness) | ablação externa de skills/MCP | implementa protocolo sem fork do loop do Mini-SWE-Agent | conferir dados originais e ambientes antes de importar qualquer pontuação |

## Hipóteses e decisões proibidas

1. Não eleger Pi, OpenHands, Hermes, OpenCode, Codex nem outra implementação sem execução equivalente.
2. Não inferir que presença de 29 padrões = qualidade, que ausência = falha, nem que os padrões formem checklist obrigatório.
3. Não comparar um donor usando modelo remoto com outro usando mock, nem comparar interfaces diferentes como se fossem execução equivalente.
4. Não estimar resultados, custos, memória ou throughput enquanto não houver execução e telemetria.
5. Não adotar como resultado do CORE uma porcentagem publicada por terceiros.

## Fases concretas de benchmark

### B0 — Inventário verificável e seleção de superfície

Registrar URL canônica, SHA, runtime e forma oficial de usar **somente o motor**. Se o donor não oferece API pública para integração, marcar `NOT_EMBEDDABLE_BY_PUBLIC_API`, anexar evidência de código e avaliar custo de adapter/process boundary (sem editar upstream). Resultado esperado: tabela por donor com evidências versionadas; ainda não pontuar desempenho.

### B1 — Fixtures funcionais offline, sem LLM

Usar os mesmos cenários determinísticos em cada donor cujo contrato permita injeção de respostas do modelo. Testar: ciclo de ação, recusa, ferramenta ausente, interrupção, limite, truncamento, efeito externo e erro. Isso mede **correção de integração**, não capacidade autônoma. Publicar logs brutos. Cenários impossíveis por API pública recebem `NOT_SUPPORTED` com motivação — nunca resultado simulado.

### B2 — Tarefas reais, modelo fixo e verificador independente

Reutilizar tarefas/offline e oráculos de [Qihoo360/harness-bench](https://github.com/Qihoo360/harness-bench) na **revisão explicitamente fixada**. Escolher subconjunto de engenharia de software, com seleção declarada antes de executar, e depois expandir se viável. Para cada candidato usar exatamente: mesmo modelo/versionamento, temperatura, limites de tokens/chamadas, recursos de máquina, ferramentas permitidas, permissões, timeout, estado inicial, ambiente isolado, semente quando suportada e verificador. Comparar resultados completos e denominadores. Repetir execuções; publicar todas, inclusive timeout/falha. Não alterar o benchmark para acomodar um candidato.

### B3 — Ablações de mecanismos respaldados por resultados

Mantendo donor, modelo e tarefas fixos, comparar controle vs tratamento para: compactação/truncamento de contexto, detecção de estagnação, autorizações e isolamento, acrescentando outras somente quando falha observada justificar. Registrar variabilidade e trade-offs; não extrapolar ganhos do estudo para este ambiente.

### B4 — Seleção e adoção mínima

Eleger base somente após B0–B3, com relatório separado de qualidade, latência, pico de memória, custos, falhas, efeitos de segurança, número de alterações ao upstream, dependências extras e dificuldade de upgrade. A decisão admite `INDETERMINADO` ou mais de um candidato sem vencedor. Código incorporado fica fora da árvore upstream intacta, via contratos públicos sempre que possível.

## Esquema de evidência

Gerar um arquivo JSON por execução, validado por [verify-run.mjs](../../bench/verify-run.mjs), com: `schema_version`, `benchmark_id`, `task_id`, `donor`, `donor_sha`, `model`, `model_version`, `fixture_sha256`, `environment`, `started_at`, `ended_at`, `status`, `oracle`, `metrics`, `raw_trace_path`, `validator_path`. Não preencher valores com `0` quando forem desconhecidos; marcar `null` e excluir de agregações. O verificador checa formato, **não comprova a autenticidade da execução**.

**Marco atual:** preparação de protocolo; B0–B4 não executados; M1–M5 continuam 0/5 aceitos.
