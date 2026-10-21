# CORE-PERFORMANCE-CONTRACT-001 — Meta de superioridade empírica

**Estado:** contrato de objetivo e política de evidência, **não resultado alcançado**.  
**Data:** 2026-10-21. **Escopo:** estritamente o motor/core e seu custo de integração; não declarar superioridade com base apenas em benchmarks de aplicações completas.

## Objetivo

O CORE deve buscar **superar o Pi como baseline de eficiência** em uma carga de trabalho representativa, **sem regressão relevante em correção, segurança ou confiabilidade**. O Pi é um **comparador obrigatório**, não donor obrigatório, arquitetura normativa ou vencedor presumido. É permitido usar outros motores se evidências demonstrarem vantagem.

“Mais eficiente” não significa apenas mais rápido nem exige vencer todas as tarefas. O resultado esperado é **melhor custo por tarefa corretamente resolvida**, considerando também latência, tokens, memória e manutenção. Todo trade-off deve permanecer explícito; uma pontuação agregada não pode esconder regressão crítica.

## Métricas e regras

| Dimensão | Métrica primária | Regra |
|---|---|---|
| Qualidade | tarefas verificadas como totalmente corretas / tentativas | Não diminuir qualidade para comprar eficiência |
| Eficiência econômica | custo total de provedor / tarefas corretas; registrar falhas e denominador | Comparar mesma tabela de preços e usage do provedor |
| Tempo | tempo real por tarefa e por tarefa correta, mediana + dispersão | Mesma máquina e ambiente controlados; registrar timeouts |
| Tokens | entrada total, entrada fresca/cache, saída, por tarefa correta | Distinguir cache; dado faltante ≠ zero |
| Memória / CPU | pico de RSS, CPU conforme medidor reproduzível | Mesmo host, limite, aquecimento e instrumentação |
| Segurança | violações de permissões/escopo e testes de rejeição | Regressão crítica é bloqueadora; não compensar com velocidade |
| Confiabilidade | quedas, retomadas, duplicação de efeitos, resultados incertos | Estados desconhecidos não contam como sucesso |
| Manutenção | patch interno, dependências obrigatórias e fricção de atualização upstream | Comparar custo de incorporação, não só harness completo |

## Comparabilidade / controles

1. Definir **antes** das execuções dataset e seleção de tarefas, oráculo externo, modelo+versão exata, temperatura, seed quando aplicável, limite de contexto, tokens e chamadas, ferramentas disponíveis, permissões, hardware, SO, timeout, workspace inicial e preço de provedor.
2. Mesmo modelo e configuração por célula comparada. Executar repetições independentes; publicar cada execução e registrar variabilidade, intervalo de confiança quando estatisticamente justificável e falhas.
3. Verificação do resultado fora do agente, sem fornecer feedback do oráculo durante o ensaio, salvo se a condição explicitamente exigir.
4. Separar **benchmark de harness completo** de **teste da biblioteca core isolada**. Resultados de terceiros não são resultados do CORE.
5. Sem threshold percentual fixado arbitrariamente: o limiar de não inferioridade de correção e a diferença mínima relevante de eficiência devem ser **pré-registrados** com justificativa ligada a variabilidade e custo operacional **antes da coleta**. Se evidência for insuficiente: `INDETERMINADO`.
6. Publicar tarefas fracassadas, censuradas/timeouts, telemetria ausente e falhas de segurança; nunca removê-las para melhorar resultados.
7. Não declarar superioridade se a diferença não for sustentada ou se houver regressão relevante na qualidade, segurança ou confiabilidade.

## Hierarquia de evidência

- `PROPOSTO`: apenas hipótese/objetivo.
- `TERCEIROS_PUBLICARAM`: resultado externo com fontes verificáveis, ainda não replicado.
- `ARTEFATOS_AUDITADOS`: dados brutos e método conciliados.
- `REPRODUZIDO`: protocolo executado com evidências locais.
- `REPLICADO`: repetido independentemente com consistência e incerteza reportadas.
- `SUPERIORIDADE_DEMONSTRADA`: aprovado nas regras pré-registradas, sem regressões bloqueadoras.

**Estado atual:** `PROPOSTO` para a alegação “CORE supera Pi”. Nenhum benchmark de CORE vs Pi equivalente, concluído e auditado foi produzido. Nem a linguagem definitiva nem o motor-base estão fixados.

## Proibições contra alucinação e seleção tendenciosa

- Não fabricar taxa de acerto, SHA, execução, latência, custos, “PASS”, ranking, logs, capacidade ou conclusão estatística.
- Não promover testes unitários de mock, README ou smoke de API a provas de superioridade.
- Não escolher o Pi por hábito; não descartá-lo de comparador por preferência. Comparar outros candidatos também.
- Não converter 7 subsistemas, 29 padrões, 13 observações ou 18 recomendações da pesquisa em pesos, requisitos obrigatórios ou rankings sem justificativa independente.
- Não mudar métricas, população, pesos ou critério de sucesso após ver resultados sem registrar claramente a alteração e reiniciar a avaliação correspondente.
- Em caso de dúvida, registrar `NÃO_VERIFICADO` e a evidência faltante, não preencher com estimativa.

## Gates vinculados

1. [Auditoria externa](docs/research/CORE-EXTERNAL-AUDIT-002.md) — literatura/benchmarks publicados, ainda insuficientes para escolher um motor.
2. [Protocolo de medição](docs/research/CORE-BENCH-001.md) — registro da metodologia B0–B4.
3. [Quadro canônico](EXECUTION-TRACKER.md) — marcos operacionais M1–M5. O presente documento **não** altera a contagem de entrega.

**Política de integração:** branch isolada, upstream íntegro, patches mínimos, revisão/merge manual; nunca merge automático.
