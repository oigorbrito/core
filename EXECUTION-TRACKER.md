# CORE — Plano de execução e progresso verificável

**Referência:** `oigorbrito/core`, branch de pesquisa `research/core-external-evidence-001`. **Data-base:** 2026-10-21.  
**Este arquivo é o quadro operacional único.** Não criar relatórios de progresso concorrentes nem abrir PR por atualização. **Nenhuma duração é estimada sem medição de throughput.**

## Como medir

A unidade de progresso é uma **capacidade operacional aceita por demonstração verificável**, não commit, LOC, documento ou passagem isolada de teste.

- `NÃO_INICIADO`: nenhuma execução demonstrada.
- `EM_IMPLEMENTAÇÃO`: código/integração existe; não atende ainda ao critério integral.
- `BLOQUEADO`: dependência específica identificada.
- `ACEITO`: critérios observáveis do pacote integralmente demonstrados, incluindo log, versão e ambiente.
- `REGRESSÃO`: capacidade previamente aceita deixou de passar e retorna ao estado não aceito.

**Percentual de aceitação do produto:** `pacotes ACEITOS / 5 × 100`. É um indicador de entregas *com mesmo peso para planejamento*, **não** porcentagem de código implementado, esforço ou maturidade arquitetural. Reportar também `0/5`, `1/5`, etc. Pacote parcial nunca conta como aceito. A cada atualização registrar SHA + evidência e não elevar por documentação.

## Escalonamento: cinco entregas fechadas

| Ordem | Pacote de entrega | Dependência | Definição observável de ACEITO | Estado na linha de base |
|---|---|---|---|---|
| M1 | **Motor integrado e controles reais** | motor escolhido/provisório; ferramenta e transporte substituíveis | Usar pacote upstream sem fork; executar modelo simulado e real configurável; tool read/write/patch/bash dentro de workspace; streaming, steer, followUp e cancelamento; reportar falhas tipadas e registro de eventos | EM_IMPLEMENTAÇÃO (apenas um ciclo echo simulado passou) |
| M2 | **Trabalho real de programação com verificação** | M1 | Em repo descartável de fixture: receber tarefa, inspecionar arquivos, aplicar patch localizado, executar teste do fixture, reportar diff e resultado; provar recusa de caminhos fora do workspace | NÃO_INICIADO |
| M3 | **Persistência, retomada e efeitos incertos** | M1/M2 | Criar sessão, parar processo, reabrir mesmo ID e continuar sem perder histórico; simular queda entre intenção e resultado de ferramenta e exigir reconciliação antes de repetição insegura | NÃO_INICIADO |
| M4 | **Políticas e robustez** | M2/M3 | Limites de output e orçamento, compactação rastreável, timeouts, permissões fail-closed, execução concorrente controlada e falhas injetadas com estados terminais explícitos | NÃO_INICIADO |
| M5 | **Integração/reaproveitamento e benchmark conclusivo** | M1–M4 | Rodar protocolo reprodutível com baseline, comparação em tarefas equivalentes e métricas de correção, latência, memória e recuperação; publicar dados brutos e decisão de adotar/adaptar/rever; sem merge automático | NÃO_INICIADO |

**Linha de base funcional ACEITA: 0/5 (0%).** Não significa trabalho zero: existe pesquisa e um smoke de integração que são insumos, mas ainda não alcançam os critérios dos pacotes. Não são evidência de implementação de M2–M5.

## Um único conjunto de métricas por bloco

Registrar por execução: `milestone`, `commit_sha`, `upstream_sha`, `runtime`, `OS`, `comando`, `exit_code`, `evidence_path`, `scenarios_passed/attempted`, `known_gaps`, `changes_to_upstream`. Para benchmark posterior acrescentar ambiente controlado, amostras, distribuição de latência, pico RSS e orçamento de tokens.

**Prazo:** ainda INDETERMINADO por ausência de throughput observado por pacote; não inventar semanas ou dias. Medir duração efetiva do primeiro pacote substantivo para projetar faixa de planejamento posterior, sem tratá-la como previsão validada.

## Ação imediata — concluir M1 sem microblocos

1. Escolher provisoriamente o motor reutilizável já executado para M1, sem tratá-lo como vencedor arquitetural.
2. Implementar de uma vez adapters de ferramentas, limites de workspace, fluxo de controle, eventos e transporte real configurável com mock por padrão; sem interface gráfica.
3. No marco de conclusão, executar suíte de integração incluindo cenário de trabalho e de negativa de permissão, consolidar logs e marcar M1 apenas se todos os critérios passarem.
4. Se falhar, registrar motivo específico e corrigir dentro do mesmo pacote; não gerar novos gates/ADRs ou PRs por tentativa.

## Regras de governança

- Preservar resultados históricos e usar a branch de pesquisa sem tocar na `main`.
- Cada pacote deve entregar código utilizável e evidência; atualização de documentação isolada não conta como progresso funcional.
- Nenhum benchmark entre alternativas com capacidades diferentes será usado para proclamar vencedor.
- Nenhum merge automático; revisões e merges dependem de autorização.
- Abrir nova PR apenas para conjunto substantivo pronto, não por cronograma.

## Atualização M1 — 2026-10-21 (implementação parcial, não validada)

- Criados `experiments/engine-embed/workspace-tools.mjs` e `m1-workflow.mjs` com leitura UTF-8 limitada, criação exclusiva, edição de ocorrência única, verificação de paths e fluxo de ferramenta/modelo simulado. `npm run m1:workflow` foi configurado.
- Reaproveita `@earendil-works/pi-agent-core@1.3.0` sem fork. Este incremento **não foi executado** nesta sessão; o PASS anterior refere-se somente a `npm run smoke`.
- Limites de segurança: confinamento por paths e rejeição de links simbólicos não constituem sandbox do SO nem garantem ausência de TOCTOU. Não foi liberada ferramenta de shell arbitrário. Escrita da edição ainda não implementa CAS atômico.
- Pendente para M1: execução do novo cenário, steering/follow-up/cancelamento, transporte real configurável, verificação e política de execução de comandos. **M1 permanece EM_IMPLEMENTAÇÃO e aceitação 0/5.**

## Pesquisa de donors — referências canônicas

- [Catálogo dos 7 subsistemas, 29 padrões e cinco donors clonáveis](docs/research/core-donors-29-pattern-coverage.md).
- [Inventário primário dos 29 padrões](docs/research/harness-study-29-patterns.md).
- **Pesquisa documentada não constitui M1–M5 aceito**; manter a linha de base funcional 0/5 e não interpretar candidatos como padrões verificados.

## Referência neutra de contrato — 2026-10-21

- Código: [`reference/core.mjs`](reference/core.mjs); testes: [`reference/test/core.test.mjs`](reference/test/core.test.mjs); limites: [`reference/README.md`](reference/README.md).
- No ambiente local desta sessão foi executada uma versão de referência equivalente com **10/10 testes unitários aprovados**; a versão publicada no GitHub **não foi executada em CI/Windows** e exige validação independente. Não reivindicar PASS remoto.
- Estes são testes determinísticos de comportamento, **não** benchmark entre engines nem comprovação científica de superioridade. Não selecionam linguagem, donor, nem provam persistência, sandbox, recuperação ou tarefas reais.
- Aceitação do produto permanece **0/5**; nenhuma PR ou merge criado por este registro.

## Esqueleto de host independente de donor — 2026-10-21

- Novo: [skeleton/README.md](skeleton/README.md), [contracts.mjs](skeleton/contracts.mjs), [host.mjs](skeleton/host.mjs), adaptadores de referência e journal em memória, seis testes em [skeleton/test/skeleton.test.mjs](skeleton/test/skeleton.test.mjs).
- Trata-se de **contrato de integração preliminar** com adaptador para referência simulada, não de substituição ou escolha de um motor upstream. Falta executar os seis testes na instalação do usuário/CI; **não declarar PASS** antes disso.
- O journal não é persistente; nenhuma garantia de sandbox, recuperação, multiagente ou benchmarks entre donors. Sem modificações em `main`, sem PR ou merge adicional. M1–M5 continuam **0/5 aceitos**.

## CORE-BENCH-001 — protocolo científico e verificador de resultados

- Protocolo: [docs/research/CORE-BENCH-001.md](docs/research/CORE-BENCH-001.md); ferramenta: [bench/verify-run.mjs](bench/verify-run.mjs); casos de teste: [bench/test/verify-run.test.mjs](bench/test/verify-run.test.mjs).
- Documentadas fontes científicas de arquitetura, políticas de contexto, benchmark controlado e segurança; extração cuidadosa das limitações de inferência. Comparação B0–B4 **ainda não executada**.
- Verificador apenas valida metadados de execuções; **não executa benchmark nem comprova autenticidade**. Seus próprios testes não foram executados neste ambiente nesta etapa; evitar declarar PASS.
- **Sem seleção antecipada de donor, sem merge ou PR adicional. M1–M5 continuam 0/5 aceitos.**
