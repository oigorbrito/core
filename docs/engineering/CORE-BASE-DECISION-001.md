# CORE-BASE-DECISION-001 — base reutilizável antes de código próprio

Data: 2026-10-21. Estado: **DECISÃO PROVISÓRIA DE IMPLEMENTAÇÃO, NÃO VENCEDOR DE BENCHMARK**.
Escopo: núcleo embutível de execução de agentes para o projeto `oigorbrito/core`.
Branch: `feat/core-runtime-foundation-001`. **Sem merge em main.**

## Decisão operacional

**Congelar** `packages/core-runtime/` como *experimento de contratos e estados*, não como motor oficial e não expandi-lo com ferramentas ou provedores.
Retomar a incorporação do núcleo **já existente** por API pública como primeira rota funcional de M1:

- `@earendil-works/pi-agent-core@1.3.0`;
- `@earendil-works/pi-ai@1.3.0`;
- experimento existente em `experiments/engine-embed/`, separado de qualquer CLI/UI.

O Pi é **primeiro para tentativa de incorporação**, porque o repositório **já possui** a prova de conceito e os contratos preparados, não porque seja o melhor core conhecido. A base final permanece aberta e sujeita a evidências de corretude, eficiência, segurança, manutenção e custo de tradução.

Antes de promover o pacote, confirmar a correspondência exata versão npm ↔ revisão de fonte (o próprio README do experimento declara essa lacuna), instalar por lockfile e executar os testes no ambiente-alvo. Uma tentativa não validada não constitui aprovação.

## Elegibilidade observada (não ranking)

| Base | Evidência de incorporação | Fronteira ou custo identificado | Status |
| --- | --- | --- | --- |
| Pi agent-core | `experiments/engine-embed/package.json`, `README.md`, dependências versionadas e mock determinístico | versão npm/source SHA ainda não conciliados; smoke não reproduzido nesta execução | **CANDIDATO OPERACIONAL M1** |
| Orca Harness | `crates/harness-core/Cargo.toml`; crate `orca-harness-core` com `tokio`, `tokio-util` e benches `dispatch`, `harness_loop` | adaptador de linguagem/processo a avaliar; vantagem publicada no harness não é vantagem isolada do core | **CANDIDATO PARA MEDIÇÃO** |
| OpenHands SDK | workspace Python `openhands-sdk`, `openhands-tools`, `openhands-workspace`, `openhands-agent-server` | escopo de extração/dependências a medir; não assumir SDK TypeScript nativo | **DOADOR PARA EVENTOS/RECUPERAÇÃO** |
| Codex core | `codex-rs/core/Cargo.toml`, `codex_core`, muitas dependências internas do workspace | alto custo potencial de extração; custo exato ainda desconhecido | **DOADOR PARA SEGURANÇA/ESTADO** |
| OpenCode | repositório disponível; subsistemas por avaliar em revisão exata | pacote interno, limites de API e dependências ainda não confirmados nesta etapa | **DOADOR CANDIDATO** |

Fontes:
- https://github.com/earendil-works/pi
- https://github.com/okikorg/orca-harness/blob/main/crates/harness-core/Cargo.toml
- https://github.com/OpenHands/software-agent-sdk/blob/main/pyproject.toml
- https://github.com/openai/codex/blob/main/codex-rs/core/Cargo.toml
- https://github.com/anomalyco/opencode

## Contratos a preservar antes de qualquer transplante

1. Histórico de eventos, execução de chamadas de ferramenta exatamente uma vez **apenas quando comprovado** e tratamento de efeitos incertos após falha.
2. Abort, steering e follow-up segundo contratos reais do SDK; não simular API inexistente.
3. Permissões e confinamento de workspace com negativas verificáveis; *path checks* não são sandbox de SO.
4. Observabilidade e custo por tarefa correta; testes com oráculo externo e mesmas configurações.
5. Integração por APIs públicas, mantendo upstream independente e sem fork sempre que possível.

## Gates mensuráveis

**G0 — Reconciliação do pacote:** versão binária, tarball hash, SHA de fonte, documentação API pública e licenças identificados. Sem isso não promover.

**G1 — Execução real do embed:** instalação travada em lockfile; mock reproduzível; eventos, uso de ferramenta, cancelamento e estado de erro testados. Guardar ambiente e logs. Falha bloqueia avanço.

**G2 — M1 completo:** ferramentas de workspace confinadas, transporte de modelo real configurável, streaming/steer/follow-up/cancelamento, autorização e tipos de falha, com testes de integração reais. Critério de aceitação em `EXECUTION-TRACKER.md`. M1 **não** é aceito antes disso.

**G3 — Disputa de bases:** apenas quando mecanismos de concorrência, contexto, recuperação, permissões e manutenção puderem ser confrontados sob fixture comum; escolha final auditável e sem reescrita desnecessária.

## O que esta etapa realmente prova

Uma base existente está identificada e existe código de experimento no repositório. A escolha provisória minimiza trabalho descartável: **não demonstra** que Pi seja melhor que Orca, OpenHands, OpenCode ou Codex.
Os cinco marcos funcionais permanecem **0/5 aceitos**. Nenhum teste ou benchmark foi executado por esta decisão.
Não alterar `main`, não mergear automaticamente, não iniciar reescrita, e não converter 29 padrões do artigo em checklist obrigatória.
