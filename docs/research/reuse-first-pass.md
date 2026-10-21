# Auditoria de reaproveitamento — primeira coleta verificável

**Situação:** PARCIAL; inspeção estática de manifestos e documentação, **sem** execução de código, benchmarks ou testes comparativos. **Não** escolher vencedor.  
**Data da coleta:** 2026-10-20 (sessão local); os endpoints do GitHub retornaram commits com horários UTC inclusive de 21/10: registrar o carimbo da fonte como retornado, sem inferir que ocorreu na data local.  
**Escopo:** somente fatos confirmados por fontes consultadas nesta coleta. A leitura de um manifesto **não prova** uma API operacional nem ausência de defeitos.

## Registro de revisões consultadas

| Projeto | Branch padrão informada | Commit HEAD da API | Prova lida | Situação |
|---|---|---|---|---|
| OpenHands/software-agent-sdk | main | `0996c33916c2a977ea9fe38deee660ff0e1389f2` | `README.md` blob `386dc8945133cb51969192b0b29c8396719cbff6` | Cabeçalho/SDK inspecionado; API de execução não auditada |
| openai/codex | main | `c7234c1174b27d9c55199fba0d546dc27d1b0415` | `codex-rs/core/Cargo.toml` blob `249f1436f64d48f4834c71830c72b3a3b80745a7` | Crate `codex-core` confirmado; API e embutibilidade a verificar |
| anomalyco/opencode | dev | `0ceeb24f8103d3b7c5719ec790834e157cf4d951` | Documento público `packages/web/src/content/docs/server.mdx` (ver URL abaixo); tentativa de `packages/opencode/package.json` retornou 404 | Superfície de servidor documentada; caminho do manifesto NÃO VERIFICADO |
| langchain-ai/deepagents | main | `4f8a6566d1c06c04f5d8d9614706f72ce64532e3` | `README.md` blob `efa13c884a5f984cf30c5da8f571fc9264e20216` | Harness extensível declarado na documentação; contratos não auditados |
| mistralai/mistral-vibe | main | `dd2c04ce717c417731ab89c333cd0a72541e33ba` | `README.md` blob `acca4fc2c494b0ea809547216f4b1dcb9f7cdca1` | Assistente CLI confirmado; API embutível NÃO VERIFICADA |
| mastra-ai/mastra | main | `4471372b0338523a2f57407a90b1d913e68f17cc` | `packages/core/package.json` blob `d8e0f3721a236327d520423616774f9870506ffb` | Pacote `@mastra/core` com exportações `.` e `./agent` comprovadas |
| badlogic/pi-mono | main (metadados) | **NÃO VERIFICADO** | Tentativa de `packages/agent/README.md` falhou no conector | Não pontuar contra; confirmar HEAD, estrutura do monorepo e SDK |

**Cuidado de reprodutibilidade:** manifesto e README foram buscados sem ref congelada; o blob SHA comprova o arquivo efetivamente retornado, mas não necessariamente que pertencia exatamente ao HEAD capturado sob concorrência de commits. **Revalidar com URL contendo SHA antes de qualquer conclusão final.**

## Primeiro confronto de capacidades, sem notas artificiais

- **C01 Loop programático:** `codex-core` nomeado como crate de lógica do produto (manifesto); `@mastra/core` exporta um entrypoint `./agent`. Isso demonstra superfícies de integração, **não** equivalência de loop.
- **C02 Integração de modelos:** candidatos plausíveis, nenhuma cadeia de execução auditada até o provider; **NÃO_VERIFICADO** para os sete.
- **C03 Ferramentas:** documentação dos harnesses sugere suporte; **DOCUMENTADO** onde aplicável, sem validação de extensões externas.
- **C04 Controle interativo:** documentação oficial de servidor OpenCode lista `POST /session/:id/abort` e endpoints de sessão/fork; não se inferem steering e follow-up equivalentes dessa rota.
- **C05 Contexto:** não foi verificada política nem código nesta coleta; **NÃO_VERIFICADO**.
- **C06 Sessões:** OpenCode documenta criar, recuperar, bifurcar e listar sessões; **DOCUMENTADO**.
- **C07 Efeitos externos incertos:** **NÃO_VERIFICADO** em todos. Não assumir outbox ou exactly-once.
- **C08 Permissões:** API do OpenCode documenta resposta a solicitação de permissão; alcance de isolamento não foi auditado.
- **C09 Concorrência:** **NÃO_VERIFICADO**.
- **C10 Extensões:** Deep Agents afirma no README permitir substituir componentes; falta conferir a superfície pública e seus limites.
- **C11 Observabilidade:** **NÃO_VERIFICADO** com provas de runtime.
- **C12 Embutibilidade:** `codex-core` é um crate Rust existente, `@mastra/core` um pacote publicado no monorepo e o OpenHands se identifica como SDK. Necessário verificar dependências, APIs públicas, serviços obrigatórios e plataforma antes de classificar como embutível no nosso cenário.

## Obstáculos factuais (não são reprovações)

1. A consulta ao `badlogic/pi-mono` não forneceu SHA de commit nem README do caminho tentado. Resolver estrutura via árvore/commit do repositório antes de classificar.
2. O caminho tentado `anomalyco/opencode/packages/opencode/package.json` retornou 404. Pode ter sido reorganizado; resolver via árvore do SHA congelado, sem supor que o pacote foi removido.
3. Os sete não passaram por teste de carga, confiabilidade, sessões, permissão nem validação determinística. Não estimar desempenho ou complexidade relativa sem dados.
4. Não foram localizados nesta árvore do projeto os artefatos CORE-02/03/04 alegados anteriormente. Não tratá-los como arquivos presentes sem inspeção de refs/localização.

## Evidências online específicas

- OpenCode: https://github.com/anomalyco/opencode/blob/dev/packages/web/src/content/docs/server.mdx
- Codex: https://github.com/openai/codex/blob/c7234c1174b27d9c55199fba0d546dc27d1b0415/codex-rs/core/Cargo.toml
- Mastra: https://github.com/mastra-ai/mastra/blob/4471372b0338523a2f57407a90b1d913e68f17cc/packages/core/package.json
- OpenHands SDK: https://github.com/OpenHands/software-agent-sdk/blob/0996c33916c2a977ea9fe38deee660ff0e1389f2/README.md
- Deep Agents: https://github.com/langchain-ai/deepagents/blob/4f8a6566d1c06c04f5d8d9614706f72ce64532e3/README.md
- Mistral Vibe: https://github.com/mistralai/mistral-vibe/blob/dd2c04ce717c417731ab89c333cd0a72541e33ba/README.md

## Prioridades de investigação que discriminam candidatos

**Primeiro:** resolver SHAs/árvores faltantes e localizar APIs públicas reais. **Segundo:** provar incorporação sem UI/servidor obrigatório e extensão sem fork. **Terceiro:** seguir a cadeia de controle/cancelamento/ferramentas até runtime real. **Quarto:** verificar recuperação/efeitos externos e limites de permissões. **Quinto:** estimar custo de adaptação com arquivos concretos. Não construir motor novo antes desse confronto.

Próximo registro deverá ampliar a matriz com caminhos/símbolos de implementação, não apenas declarações de README. Preservar investigação na branch, sem criar PR adicional nem realizar merge.
