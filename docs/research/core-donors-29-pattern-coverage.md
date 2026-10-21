# Bases clonáveis e rastreio dos 29 padrões (CORE-DONORS-001)

**Status:** catálogo de candidatos e hipóteses da literatura, **não** validação independente de cada padrão.  
**Fonte primária:** Barbaste et al., *Harness Engineering: Anatomy, Architecture, and Evolution of Coding Agents*, arXiv:2609.00006v1, §13.1, tabelas 11–12: https://arxiv.org/html/2609.00006v1#S13.SS1  
**Inventário original:** [harness-study-29-patterns.md](./harness-study-29-patterns.md).  
**Execução:** [EXECUTION-TRACKER.md](../../EXECUTION-TRACKER.md).  
**Data:** 2026-10-21.

## Decisão metodológica

- Os **7 subsistemas** são: (D1) loop de agente; (D2) integração LLM; (D3) ferramentas/ações; (D4) contexto/memória; (D5) segurança/permissões; (D6) orquestração; (D7) extensibilidade.
- Os **29 padrões não formam uma checklist para implementar todos**: há alternativas e variantes. A presença de um padrão **não implica** ser a melhor implementação ou medir sucesso de tarefas.
- O quadro a seguir reproduz **associações de trabalho discutidas a partir do artigo**. Variantes, casos sem enumeração e edições de versionamento **exigem confronto com a tabela original e SHA do código** antes da classificação como confirmado. Não presumir equivalência entre palavras iguais e implementação equivalente.
- Não escolher linguagem, engine vencedor ou dependência por preferência, maturidade aparente ou único smoke.
- A unidade de avaliação por repositório/padrão será: `artigo→repo@SHA→caminho:símbolo→comportamento→API de incorporação→teste reproduzível→custo de adaptação`.

## Repositórios prioritários para clonagem separada

| Donor | Fonte Git | Papel na investigação | Evidência já executada no CORE |
|---|---|---|---|
| OpenHands Software Agent SDK | https://github.com/OpenHands/software-agent-sdk | Loop, ferramentas, workspace, sessões e verificação | **Não executado** no ambiente do projeto |
| OpenCode | https://github.com/anomalyco/opencode | Sessões, edições, permissões, contexto, extensibilidade | **Não executado** |
| Hermes Agent | https://github.com/NousResearch/hermes-agent | Memória, stuck detection, verificação, skills | **Não executado** |
| Codex | https://github.com/openai/codex | Segurança, isolamento, delegação e prompts | **Não executado** |
| Pi | https://github.com/earendil-works/pi | Minimal core, interface e extensões, sessões | **Smoke de integração com modelo simulado PASS, relatado pelo operador**; não é prova comparativa |

**Outros projetos presentes na amostra/padrões, não descartados:** https://github.com/Aider-AI/aider ; https://github.com/google-gemini/gemini-cli ; https://github.com/mistralai/mistral-vibe ; https://github.com/SWE-agent/mini-swe-agent ; OpenClaw e Claude Code (verificar fontes e disponibilidade antes de incluí-los como donors). Não confundir projetos listados na literatura com software necessariamente incorporável por SDK.

## Referência operacional por subsistema (não ranking)

| Subsistema | Fontes de inspeção prioritárias | Pergunta objetiva |
|---|---|---|
| D1 Loop | OpenHands; OpenCode; Pi | O loop está embutível sem trazer UI/servidor? |
| D2 LLM | Codex; Hermes; OpenCode | Modelos, streaming, cache, prompts são configuráveis? |
| D3 Ferramentas | OpenCode; Aider; Codex | Leitura/edição/execução usam contrato público e permissões? |
| D4 Contexto | OpenHands; Hermes; Pi | Compactação, histórico e retomada realmente funcionam? |
| D5 Segurança | Codex; OpenCode; Gemini CLI | Há isolamento efetivo, controle de comandos e rejeição fail-closed? |
| D6 Orquestração | OpenHands; Codex; Hermes | Delegação e verificação podem ser acopladas sem fork? |
| D7 Extensibilidade | Pi; OpenHands; Hermes | Adições sobrevivem a upgrades upstream sem patches privados? |

## Rastreio P01–P29: candidatos reportados na discussão da fonte

A coluna não é evidência de verificação própria nem certificação de cobertura. Exigir na etapa seguinte a referência exata à linha da tabela-fonte, código versionado e validação. Alguns nomes designam **variantes**, não a mesma semântica.

| ID | Padrão da literatura | Sistemas candidatos citados |
|---|---|---|
| P01 | Event Sourcing | OpenHands; Pi; OpenCode |
| P02 | Policy-as-Code | Codex; Claude Code; Gemini CLI; Hermes; OpenCode; Pi |
| P03 | Recursive Composition | Claude Code; Codex; OpenHands; OpenClaw; Hermes; OpenCode |
| P04 | Polymorphic Edits | Aider; OpenCode |
| P05 | Deferred Loading | Claude Code; Codex; Hermes; outros sistemas com skills |
| P06 | Template Method | Aider; OpenHands |
| P07 | Protocol Interfaces | Mini-SWE-Agent; Pi |
| P08 | LLM Summarization | Múltiplos sistemas (verificar linhas da fonte) |
| P09 | Stuck Detection | OpenHands; Gemini CLI; Hermes; OpenCode; Mini-SWE-Agent |
| P10 | Reflection Loop | Aider; variantes Gemini CLI/OpenCode |
| P11 | Prompt Caching | Claude Code; Codex; OpenHands; Hermes; Pi; OpenCode |
| P12 | Context Forking | Claude Code; Codex; Hermes |
| P13 | Middleware Pipeline | Mistral Vibe |
| P14 | JIT Repo Context | Claude Code; Codex; Gemini CLI; Mistral Vibe; Hermes; Pi; OpenCode; OpenHands |
| P15 | Skills (capability bundles) | Diversos sistemas; validar tabela primária |
| P16 | Conditional Activation | Claude Code; OpenHands; OpenClaw |
| P17 | Turn-Level Checkpoint | Mistral Vibe; OpenCode; Hermes; variante conversacional Pi |
| P18 | Agent-Maintained Memory | Codex; variante supervisionada Gemini CLI |
| P19 | Outer Verification Loop | OpenHands; Hermes |
| P20 | Self-Improving Skill Loop | Hermes; variante parcial Gemini CLI |
| P21 | Lineage Compaction | Hermes |
| P22 | Session-Tree Version Control | Pi; OpenHands |
| P23 | Minimal-Core / Extension-Host | Pi |
| P24 | Client/Server Harness | OpenCode; OpenHands |
| P25 | Model-Family Prompt Matrix | Codex; OpenCode; Hermes |
| P26 | Cache-Dialect Fanout | OpenCode |
| P27 | Syntax-Aware Command Permissioning | OpenCode; variantes Mistral Vibe/Hermes |
| P28 | Untrusted-Content Delimiting | Hermes; OpenHands |
| P29 | Harness Mimicry | Pi |

## Protocolo de clonagem e menor refatoração

1. Clonar donors em **diretórios separados**, sem alterações no `oigorbrito/core` nem em `main`; registrar URL, `HEAD`, data e `git status --porcelain` antes da comparação. O clone inicial pode ser `--depth 1`, mas o relatório deve registrar limitação de histórico.
2. Para cada P01–P29, conferir associação na tabela primária e localizar `caminho:símbolo` no **SHA efetivamente clonado**. Classificar `CONFIRMADO_CODIGO`, `DOCUMENTADO_NAO_VERIFICADO`, `VARIANTE`, `AUSENTE` ou `INDETERMINADO`.
3. Para os padrões relevantes ao contrato mínimo, registrar `API_PUBLICA`, `CONFIGURACAO`, `ADAPTADOR`, `FORK_INTERNO` ou `NÃO_INCOPORÁVEL` (corrigir eventuais nomes conforme critérios claros). Distinguir dependências obrigatórias de opcionais.
4. Comparar esforço com evidências mensuradas (patch LOC, componentes/forks, dependências extras, upgrade friction, testes que passam, memória/latência no mesmo fixture). **Não inventar pontos, pesos, horas ou cobertura.**
5. Utilizar o Pi apenas como baseline de incorporação já demonstrada; nenhum motor tem privilégio metodológico. Não integrar 5 engines, não reconstruir loop, não abrir novas PRs por relatório e **não realizar merge automático**.

## Indicadores auditáveis separados do produto

- **Catálogo:** 29/29 identificadores inventariados no arquivo primário (transcrição, não implementação).
- **Inspeção independentemente comprovada por padrão/donor:** **não apurada nesta etapa**.
- **Benchmarks equivalentes entre candidatos:** **0 protocolos concluídos neste esforço**.
- **Entregas operacionais aceitas M1–M5:** continuar utilizando o quadro canônico; nenhuma documentação altera a contagem.
- **Critério de saída do trabalho de seleção:** um mapa auditável `P-ID → fonte → símbolo → resultado → forma de reaproveitar`, seguido de decisão com ressalvas explícitas. Nenhum vencedor será declarado antecipadamente.

## Segurança e uso dos padrões

P29 (`Harness Mimicry`) foi observado na literatura, mas **não é recomendado como arquitetura de autenticação** e não autoriza falsificação de identidade ou reutilização indevida de credenciais.

## Clonagem conservadora — PowerShell Windows

```powershell
$ErrorActionPreference = "Stop"
$base = "D:\projetos\core-donors"
$repos = [ordered]@{
  openhands = "https://github.com/OpenHands/software-agent-sdk.git"
  opencode  = "https://github.com/anomalyco/opencode.git"
  hermes    = "https://github.com/NousResearch/hermes-agent.git"
  codex     = "https://github.com/openai/codex.git"
  pi        = "https://github.com/earendil-works/pi.git"
}
New-Item -ItemType Directory -Path $base -Force | Out-Null
foreach ($nome in $repos.Keys) {
  $destino = Join-Path $base $nome
  if (Test-Path -LiteralPath $destino) {
    Write-Host "PRESERVADO (inspecionar manualmente): $destino"
    continue
  }
  git clone --depth 1 --filter=blob:none $repos[$nome] $destino
  if ($LASTEXITCODE -ne 0) { throw "Falha no clone de $nome" }
  $sha = git -C $destino rev-parse HEAD
  Write-Host "$nome $sha"
}
```

A clonagem, isoladamente, não comprova a existência dos padrões nem constitui benchmark.
