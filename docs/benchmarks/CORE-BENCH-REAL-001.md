# CORE-BENCH-REAL-001 — comparação Pi × Orca por tarefa correta

Data: 2026-10-21. Estado: **PRÉ-REGISTRADO / NÃO EXECUTADO**.
Base: `feat/core-runtime-foundation-001` @ `07cc19275c01b482789a74059ec0c3399ff00b34`.
Evidência anterior: `docs/benchmarks/pi-orca-paired-evidence-2026-10-21.md`.

## Hipótese e unidade experimental

Comparar **custo de inferência local, tempo completo e correção externa** de Pi vs Orca executando as mesmas tarefas de engenharia de software. Unidade: par (task_id, trial_id, modelo, configuração), com workspace limpo e isolado por candidato. Bloquear inferência paga e qualquer fallback remoto. Diferenciar medição do harness completo de atribuição causal ao core isolado.

**Nenhum vencedor será declarado** sem resultados empíricos de pares elegíveis e sem não inferioridade de correção. O contraste anterior de bytes JSON internos não é token usage.

## Gate 0 — elegibilidade obrigatória, com falha fechada

1. Usar serviço Ollama local, bind explícito em localhost, e modelo com digest de pesos fixado; não usar API key de terceiros nem proxy OpenRouter.
2. Antes de acoplar Pi/Orca, executar 3 respostas independentes da **mesma** ferramenta artificial `write_file({path, content})` em endpoint/modelo escolhido. Exigir mensagem estruturada com `tool_calls`, nome exato e argumentos JSON parseáveis nos 3 resultados, sem fallback de texto JSON.
3. Validar compatibilidade efetiva **em ambos os adaptadores oficiais**, mantendo API/transport configurados explicitamente e sem parser ad hoc que recupere tool-call de texto. Se qualquer core não conseguir usar o mesmo endpoint, marcar `PAIR_INELIGIBLE`, não `CORE_LOST`.
4. Inspecionar logs para comprovar que ambas as execuções enviam ao mesmo endpoint e digest; capturar wire request (redigir segredos), `usage` e resposta. Se `usage` não vier do backend, tokens = null: não substituir por bytes nem usar um tokenizer presumido.

Os modelos Qwen 2.5 Coder 3B, 7B e DeepSeek Coder 1.3B nas configurações já reprovadas **não** devem ser repetidos sem mudança justificada de versão/transport ou evidência de capacidade estruturada.

## Matriz comparativa predefinida

| Gate | Métrica | Instrumentação | Regra de exclusão |
|---|---|---|---|
| A — Consumo | prompt_tokens, completion_tokens, cached_tokens quando disponível, chamadas, turns; soma por tentativa | interceptação no adapter/model boundary + usage do mesmo backend | ausência de usage => `UNKNOWN_TOKENS`; não preencher zero |
| B — Velocidade | wall-clock monotônico entre solicitação ao harness e fim/verificação; latência por chamada, CPU e pico de RSS quando disponíveis | medição fora do processo com relógio monotônico; logs start/end e timeout | timeout conta falha; não excluir outliers sem regra pré-registrada |
| C — Eficácia | proporção de tarefas aprovadas em oracle externo, alterações fora do escopo, testes de regressão | testes invocados por supervisor depois do término em workspace isolado | auto-relato do agente nunca equivale a PASS |

**Tarefa correta**: passes de todos os testes secretos/independentes previstos para a tarefa, patch restrito ao escopo, e saída do processo consistente, sem intervenção humana. Nunca dar feedback de oracle secreto ao agente durante o trial.

## Dataset e repetição

- Começar por **três tarefas reais distintas** e verificáveis: correção de limite de retry, correção de validação de argumentos, e correção de bug de cancelamento em repositórios/fixtures congelados. Selecionar fixtures e testes **antes** das medições; publicar URLs/SHAs ou blobs + SHA-256, patch inicial, teste-oráculo e comando exato. Não aceitar tarefas fabricadas para favorecer API interna de candidato.
- Rodar no mínimo **5 trials por tarefa e core** após elegibilidade, em ordem pareada alternada AB/BA, total nominal 30 execuções. 5 é piloto descritivo, não amostra suficiente para alegação estatística ampla.
- Mesma temperatura, contexto, budget máximo de tokens, turnos, ferramentas, timeout, processo de inferência, máquina, recursos, worktree inicial e permissões. Uma requisição por vez no backend para evitar contaminação de concorrência; separar compilações/aquecimento das medições.
- Se alguma diferença de interface não puder ser igualada por contrato público, documentar diferença na matriz, marcar `NON_EQUIVALENT_INTERFACE` e **não** interpretar diferença como efeito isolado do core.

## Registro bruto obrigatório

Um JSONL por chamada ao backend (request sanitized, response, provider_usage, monotonic timestamps, response error), um JSON por trial (task SHA, oracle SHA, model digest, Pi package/version + upstream SHA, Orca binary/revision, OS/CPU/RAM, args, exit status, duration, wall clock, token usage, oracle result, modifications, raw file paths), e um manifesto SHA-256 de tudo. Capturar resultados negativos, rejeitados e timeouts.

### Agregação e decisão

- Mostrar *todas* as tentativas no denominador; `correct / attempted` por core, task e geral.
- Mostrar tokens e wall time por tarefa **tentada** e custo de recursos total por tarefa **correta**, incluindo gastos das tentativas falhas: `sum(tokens_all_trials)/number_correct`, `sum(duration_all_trials)/number_correct`. Denominador zero => indefinido, nunca zero.
- Mostrar diferenças pareadas, distribuição por tarefa, mediana e intervalo descritivo. Reportar separadamente ganho condicionado às tarefas corretas e efeito de falhas; não selecionar apenas sucesso para criar falsa eficiência.
- Sem preço de inferência pago, apresentar uso de tokens e recursos locais, **não custo financeiro**; energia/dinheiro exigem medição/tarifa independente.
- Se eficácia divergir, reportar trade-off em vez de vitória por velocidade. Com 3 tarefas e 5 trials, decisão padrão é `PILOT_INCONCLUSIVE` até expansão e regra de não inferioridade fundamentada, pré-registrada com base em variabilidade real.

## Execução e CI

Não alterar `core-orca-pi-one-task.yml` para consumir segredos. Novo benchmark deve usar runner local dedicado com Ollama, ou runner comprovadamente dotado de inferência local sem cobrança; não acionar workflows GitHub hospedados que pressupõem serviço Ollama inexistente. Três gates podem agregar o mesmo conjunto de trials em jobs independentes **sem triplicar a inferência**. Cada gate valida e publica seus próprios resultados sobre um dataset bruto comum, e não substitui os outros.

Bloquear runs com endpoint diferente de localhost ou variável/chave de provedor remoto ativa. Não fazer merge automático; não alterar main; registrar SHA e logs antes de declarar PASS.
