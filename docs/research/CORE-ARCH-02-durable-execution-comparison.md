# CORE-ARCH-02 — Comparação arquitetural falsificável

**Estado:** especificação experimental, NÃO uma decisão de adoção. **Data:** 2026-10-21.  
**Objetivo:** encontrar a arquitetura existente mais simples que suporte trabalho de programação interrompível, recuperável e seguro, sem reescrever loop, eventos ou scheduler já fornecidos pelo donor.

## Correção da hipótese anterior

Não selecionar “loop + supervisor + event sourcing + SQLite” por desenho antecipado. Esses são mecanismos possíveis, não requisitos arquitetônicos. O requisito verificável é **continuidade correta sob falha e intervenção**. Não criar um segundo loop/orquestrador em cima de outro enquanto não for demonstrada uma lacuna.

## Alternativas e evidência presente

| Estratégia | Base/contrato | Evidência disponível | Não demonstrado no CORE | Custo que precisa ser medido |
|---|---|---|---|---|
| A. Agente embutido com checkpoint externo | Pi Agent Core `@earendil-works/pi-agent-core@1.3.0` | Smoke offline em Windows fornecido pelo operador: 2 turns, 1 tool, 16 eventos, PASS; APIs públicas de steer/followUp/abort identificadas | Restart, reconciliação de operações, ambiente real, interrupções e limites | LOC de adaptador, dependências, risco de duplicação de estado |
| B. SDK orientado a estado e eventos | OpenHands SDK | Código upstream contém ConversationState.create restaurando sessão, EventLog, base_state e modelos de eventos | Prova local em Windows e recuperação de efeitos de resultado incerto | Python/deps, APIs públicas necessárias, serviços opcionais |
| C. Execução durável de grafo | LangGraph | Checkpointers por thread, tarefas com replay de resultados e documentação de idempotência | Efetividade/custo para coding agent real e preservação de loop donor | Nós/arestas adicionais, bridge com agente, backend de checkpoint |
| D. Workflow durável | Temporal | Histórico/replay determinísticos, fronteira entre workflow e activities | Capacidade local sem serviço permanente; duplicação de atividades na janela de falha | Serviço, workers, deploy, semântica de retries |

**Fontes para confirmação do comportamento de APIs:**  
- https://github.com/OpenHands/software-agent-sdk/blob/main/openhands-sdk/openhands/sdk/conversation/state.py  
- https://github.com/OpenHands/software-agent-sdk/blob/main/openhands-sdk/openhands/sdk/conversation/impl/local_conversation.py  
- https://langchain-ai.github.io/langgraph/concepts/durable_execution/  
- https://github.com/langchain-ai/docs/blob/main/src/oss/langgraph/functional-api.mdx  
- https://docs.temporal.io/workflows  

São **evidências de implementação e documentação**, não benchmarks controlados nem prova de equivalência. Capturar SHA exato dos donors antes dos experimentos.

## Modelo observável de falhas (mesmo para cada candidato)

Todas as implementações recebem a **mesma tarefa determinística**: em workspace descartável, editar um arquivo de fixture para satisfazer um teste local, reportar o diff e concluir com estado terminal. Usar provedor simulado que emite os mesmos passos e tokens. Preparar um processo controlador **externo ao processo sob teste**, que injeta interrupções nos pontos abaixo:

| Cenário | Corte/perturbação | Critério de aceitação |
|---|---|---|
| F0 — baseline | nenhuma falha | resultado correto, teste passa, eventos explicam decisões |
| F1 — antes do efeito | processo encerrado após intenção registrada e antes de executar | retomada conclui sem perder tarefa; nenhuma mutação antes do commit |
| F2 — depois do efeito, antes do registro de resultado | escrita concluída e processo morto antes do ACK durável | **não repetir cegamente**; detectar resultado existente, reconciliar ou suspender como INCERTO |
| F3 — intervenção | orientação do usuário entre duas etapas | orientação aplicada em ordem documentada, sem resposta obsoleta |
| F4 — cancelamento | cancelar com ferramenta em andamento | nenhum novo efeito após cancelamento confirmado; resultado parcial explícito |
| F5 — retorno adversarial | saída excessiva/erro/timeout de ferramenta | estado terminal ou suspenso explícito, sem loop indefinido |
| F6 — concorrência | duas execuções sobre mesmo recurso | lock, CAS ou conflito detectado; não corromper conteúdo |
| F7 — persistência | fechar programa, reabrir mesma sessão | retomar sem reexecutar resultados já confirmados |

**Precisão semântica:** “exactly once” global para efeitos externos arbitrários não é requisito honesto. O teste exige comportamento explícito para estado incerto: idempotência quando disponível, verificação e reconciliação, ou bloqueio até intervenção. Temporal e LangGraph também exigem atenção a esses limites; replay não é garantia automática para qualquer atividade.

## Métricas e artefatos obrigatórios

Para cada candidato/cenário: `donor_commit`, `adapter_commit`, `OS`, `runtime`, `commands`, `fixture_hash`, `injection_point`, `tool_effect_count`, `final_file_hash`, `session_status`, `resume_count`, `result`, `failure_reason`. Capturar stdout/stderr e JSONL brutos; considerar apenas testes realizados, nunca previstos.

Métricas comparáveis: taxa de conclusão correta por cenário; operações duplicadas; casos incertos reconhecidos; latência total/p50/p95 em repetições, RSS máximo, dependências e serviços obrigatórios; LOC *novos* de glue, número de patches upstream (alvo zero), cobertura de APIs públicas. Mesma máquina, fixture, transport, orçamento e número de repetições; não comparar latência entre diferentes modelos reais.

## Gates decisórios que evitam viés

1. **Sem refatoração de donor** até que um teste necessário falhe e se demonstre que as APIs públicas não resolvem.
2. **Candidato A já passou somente F0 parcial**, com ferramenta echo simulada; não contar F0 completo. `m1-workflow.mjs` foi adicionado mas **não validado**.
3. Priorizar verificar B em persistência/efeitos incertos, pois fornece capacidades nativas documentadas. Se resolver o requisito por configuração, não construir plataforma de durabilidade.
4. C e D são **controles de arquitetura**, não dependências a instalar automaticamente. Avaliar somente o subconjunto necessário com instância descartável e sem infra permanente se possível.
5. Eliminar soluções que exijam segundo orquestrador redundante, fork sem justificativa, ou efeitos de estado incerto repetidos silenciosamente.
6. **Nenhum vencedor até resultados executados**. Apresentar matriz `PASS/FAIL/NOT_RUN/INCONCLUSIVE`, tempo/custo de integração e tradeoffs, não pontuação arbitrária.

## Fronteira candidata mínima — condicional, não desenho fechado

`Public API (start, intervene, stop, resume, observe)` → `Engine/SDK nativo escolhido` → `Workspace + Tools`; armazenamento e recuperação **nativos do engine quando forem suficientes**. Uma extensão de durabilidade separada só será adotada mediante F2/F7 falhando com custo menor de correção que mudar de donor.

## Trabalho a seguir

1. Auditar *APIs concretas* de persistência, eventos e ferramentas para dois candidatos prioritários (Pi e OpenHands), citando arquivos/SHAs, dependências e limites.
2. Implementar **um controlador externo de injeção de falha**, comum aos candidatos, sem simular PASS; fixture determinística e pontos de corte explícitos.
3. Executar F0–F2 e F7 nos dois candidatos. Só ampliar para F3–F6 depois que houver dados dos riscos mais graves.
4. Registrar resultado no `EXECUTION-TRACKER.md` sem contar este documento como entrega funcional M1–M5.

**Governança:** sem merge automático, sem PR nova, sem reescrita e sem mexer na `main`.
