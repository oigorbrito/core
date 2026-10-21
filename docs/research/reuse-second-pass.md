# Auditoria de reaproveitamento — segunda passada: correções e código-fonte

**Estado:** evidência estática de mecanismos, sem benchmarks, sem execução e sem aprovação de adoção. **Baseline:** registro anterior `reuse-first-pass.md`; este texto corrige hipóteses e caminhos sem apagar histórico.

## Mudanças factuais frente à primeira passada

1. **Pi foi transferido oficialmente:** `badlogic/pi-mono` → `earendil-works/pi`, com pacotes `@earendil-works/*`. Fonte primária: https://pi.dev/changelog/2026/5/7/pi-has-a-new-home . **SHA HEAD consultado:** `16f5f0af4d85ca583d045ceb5ed6d646fcaf7761`. O erro "Moved Permanently" anterior era mudança de endereço, **não** indisponibilidade do projeto.
2. **OpenCode reorganizou monorepo:** o pacote de motor consultado existe em `packages/core`, não no caminho antigo `packages/opencode`. **SHA HEAD consultado:** `0ceeb24f8103d3b7c5719ec790834e157cf4d951`.
3. **OpenHands SDK:** o caminho inicial `openhands/sdk/agent/agent.py` retornou 404; localizar arquivo pela árvore congelada antes de concluir qualquer ausência.

## Inspeções concretas de implementação (URLs devem ser revalidadas em commit fixo)

| Candidato | Arquivo efetivamente lido | Blob SHA | Evidência observada | O que NÃO prova |
|---|---|---|---|---|
| Pi (`earendil-works/pi`) | `packages/agent/src/agent.ts` | `ee8e6e59140b75a90d9afa0c4ef532465b2fc793` | `Agent`, estado, `runAgentLoop`, tipos `QueueMode`, `AgentEvent`, `BeforeToolCallContext` e `AfterToolCallContext`; separação módulo de agente ↔ pacote de LLM | Segurança transacional e recuperação de efeitos incertos |
| Pi | `packages/agent/src/agent-loop.ts` | `f406aba5647adeb6d879a94d946a52436bfb6af3` | Funções `agentLoop` e `agentLoopContinue` devolvem `EventStream<AgentEvent,AgentMessage[]>`; propagação de `AbortSignal`; retomada impõe precondição para última mensagem | Equivalência semântica de sessões após crash ou exactly-once |
| OpenCode | `packages/core/src/session/prompt.ts` | `80878f354dd682311e518cac132f46b61df77523` | `SessionPrompt.prepare` em `Effect`, evento `session/prompt` via `PluginHooks`, `delivery` default `steer`, materialização concorrente de anexos (limite 8 naquele ponto) | Extensibilidade sem dependências do runtime Effect ou custo de embed |
| OpenCode | `packages/core/package.json` | `553daa74cde791f2fa2633ae3f3426b002bbb3d7` | Pacote `@opencode/core`, versão declarada `2.1.1`, export `./* → ./src/*.ts`; imports condicionais de SQLite, PTY e outros por plataforma | API estabilizada: export amplo de código-fonte não implica contrato semver |
| Codex | `codex-rs/core/Cargo.toml` | `249f1436f64d48f4834c71830c72b3a3b80745a7` | Crate `codex-core` com dependências extensas de outros crates Codex | Embutibilidade desacoplada/custo aceitável |
| Mastra | `packages/core/package.json` | `d8e0f3721a236327d520423616774f9870506ffb` | Exports públicos `@mastra/core` e `./agent` no manifesto | Garantias de cancelamento/recuperação |
| OpenHands SDK | `README.md` | `386dc8945133cb51969192b0b29c8396719cbff6` | Projeto se identifica como SDK, aponta docs e tech report | Loop/programação pública efetivamente validada |
| Deep Agents | `README.md` | `efa13c884a5f984cf30c5da8f571fc9264e20216` | Declara extensão/substituição de componentes | Independência da pilha subjacente |
| Mistral Vibe | `README.md` | `acca4fc2c494b0ea809547216f4b1dcb9f7cdca1` | Assistente CLI, foco Unix apesar de suporte Windows declarado | API pública de engine |

**Controle de versão:** o SHA de arquivo é o objeto efetivamente lido. Como algumas consultas ao arquivo não utilizaram `ref=<HEAD congelado>`, não afirmar equivalência comprovada entre o arquivo e o HEAD capturado em chamada separada. A próxima coleta deve repetir `fetch_file` com ref explícita.

## Consequências técnicas para a comparação

- **Pi:** confirmado candidato com loop público e streaming de eventos no código; comparar semântica precisa dos hooks/filas e separação entre `pi-agent` e camada de sessão.
- **OpenCode:** refutar a premissa anterior de que o pacote não existe; inspecionar `packages/core` e identificar camada `Effect`, ciclo de vida e API realmente suportada.
- **Codex:** `codex-core` é crate real, porém seu manifesto aponta forte integração no monorepo; exigir extração de dependências concretas antes de sugerir reutilização leve.
- **Nenhuma escolha de mecanismo de persistência:** o fato de OpenCode ter `#sqlite` por plataforma não comprova outbox, reconciliação ou retomada sem efeitos duplicados.
- **Sem escore fechado:** não somar recursos observados e chamar de desempenho do core.

## Próximo aprofundamento sem repetir trabalho

1. Revalidar arquivos no SHA exato e localizar teste upstream que exercite eventos, steering, cancelamento e extensão.
2. Para OpenHands, localizar e inspecionar o executor/loop real pela árvore, não por caminho deduzido.
3. Examinar superfícies de incorporação dos três motores `Pi`, `OpenCode` e `Codex` contra APIs públicas, compilação e dependências, não por popularidade.
4. Investigar `OpenHands`, `Deep Agents`, `Mastra` e `Mistral Vibe` em igualdade de critério.
5. Registrar gaps por requisito histórico e custo de adaptação de forma rastreável antes de recomendar adoção.

**Merge/manual; sem PR nova, benchmark ou alteração de produção.**
