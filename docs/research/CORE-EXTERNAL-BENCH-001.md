# CORE-EXTERNAL-BENCH-001 — Evidências publicadas antes de testes novos

**Estado:** revisão documental de resultados de terceiros (2026-10-21). **Nenhuma execução local, replicação ou validação dos dados brutos realizada.** Não declarar vencedor nem transformar números publicados em benchmarks do CORE.

## Fontes e rastreabilidade

| Fonte | URL | Escopo/resultado verificável | Força e limites |
|---|---|---|---|
| Independent same-model harness comparison (rajshah4) | https://github.com/rajshah4/harness-benchmark ; https://github.com/rajshah4/harness-benchmark/blob/main/METHODOLOGY.md ; https://github.com/rajshah4/harness-benchmark/blob/main/BENCHMARK_RESULTS.md ; https://github.com/rajshah4/harness-benchmark/blob/main/REPLICATION-CAVEATS.md | Modelo GLM-5.2 com prompts, ambiente, permissões e verificadores externos compartilhados em 8 tarefas curtas e 2 médias: 8/8 para OpenHands/OpenCode/Pi nas curtas; 1/2 OpenHands e 2/2 OpenCode/Pi nas médias. Curta: Pi 678s/$0.3345, OpenCode 838.6s/$0.5711, OpenHands 1140.8s/$1.2489. | Estudo de pequena amostra produzido por terceiros; não reproduzido pelo CORE. Seus próprios autores registram limitações de parâmetros, cache/telemetria e calibração. O Codex primário foi separado por usar outro modelo; não misturar essa linha às comparações equivalentes. |
| Harness-Bench — Qihoo360 | https://github.com/Qihoo360/harness-bench | README apresenta 300 tarefas offline (274 gerais + 26 multimodais), 1408 módulos avaliáveis; harnesses Codex, Hermes, OpenCode, OpenClaw, Claude Code, Nanobot e Goose; tarefas e graders versionáveis. | Infraestrutura e escopo públicos; **não extraídos resultados pontuais para comparar candidatos**. README evolui; fixar SHA antes de reproduzir. Ausência de OpenHands na lista dos sete harnesses impede comparar esse donor diretamente sem novos ensaios. |
| OpenHands Benchmarks | https://github.com/OpenHands/benchmarks | Avaliação de SWE-bench, SWE-bench Pro, GAIA, Commit0, segurança e outros; migração V0→SDK V1 indicada. | Benchmark originado do projeto OpenHands; útil para testes e paridade de versão, não independente por padrão. |
| SWE-bench Verified | https://www.swebench.com/verified | 500 tarefas humanas filtradas; leaderboard público e baseline bash-only com mini-SWE-agent. | Resultados multi-scaffold combinam diferenças de modelo, versões e estratégias; não são ranking puramente arquitetural. A própria documentação alerta que versões mini-SWE-agent 1.x e 2.x não são automaticamente equivalentes. |
| HarnessSecurity-Bench | https://arxiv.org/abs/2610.07639 | Segurança e utilidade sob configurações de harness; evidência relevante para permissões. | Não substitui auditoria local de sandbox ou autorização; resultados não transferíveis automaticamente. |
| Harness Engineering | https://arxiv.org/html/2609.00006v1 | 11 sistemas, 7 subsistemas, 29 padrões, 13 observações, 18 recomendações. | Anatomia observacional, não benchmark com ranking. |

## Implicações operacionais — evitar ensaio redundante

1. **Suspender o início de B1/B2** até verificar resultados brutos, versões dos donors, oráculos e limites de equivalência dos benchmarks acima.
2. Priorizar auditoria dos artefatos publicados no experimento same-model: metadados dos runs, ledger do provedor, comando de inicialização e fixtures. **Não utilizar os resultados como prova de menor esforço de integração ou melhor arquitetura geral.**
3. Inspecionar os sete harnesses listados em Harness-Bench antes de executar um benchmark competitivo novo; estudar possibilidade de reutilizar seu runner/grader no lugar de implementá-los novamente.
4. Separar níveis de evidência `PUBLICADO_TERCEIRO`, `ARTEFATO_AUDITADO`, `REPRODUZIDO_LOCAL`, `REPLICADO_INDEPENDENTEMENTE`; estado atual predominantemente `PUBLICADO_TERCEIRO`.
5. Não promover um motor por preferência, linguagem, simplificação do loop ou vitória numa amostra pequena. Os 29 padrões não foram benchmarkados isoladamente nesses resultados.
6. Para o **core estrito**, aferir incorporação e interfaces separadamente de sucesso de tarefas do harness completo; resultados de sistemas completos **não medem diretamente** qualidade de suas bibliotecas de núcleo.

## Lacunas que persistem mesmo com os benchmarks externos

- APIs estáveis de incorporação, dependências obrigatórias e custo para reutilizar apenas o loop; B0 de donors precisa de SHAs de commits, não somente blobs.
- Interrupção, recuperação pós-crash e reconciliação de efeitos; autorização fail-closed sob ameaça, isolamento real.
- Custos de portabilidade e atualização upstream com mínima refatoração.
- Replicação independente da comparação em Windows / ambiente-alvo.
- Não há evidência pública verificada de um vencedor único que satisfaça todas as necessidades arquiteturais do CORE.

## Próximo bloco útil

**CORE-EXTERNAL-AUDIT-002:** extrair tabelas com IDs individuais de tarefas, repositório@SHA, modelo, variantes, oráculo, resultados brutos e riscos de confusão; verificar consistência estatística/descritiva dos dados antes de qualquer nova execução. Somente publicar resultado de benchmark **CORE** após realmente executar os fixtures. Nenhum merge automático.
