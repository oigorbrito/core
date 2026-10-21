# CORE — Protocolo operacional de auditoria de reaproveitamento (versão 1)

**Status:** instrução de execução para pesquisa; não é decisão de adoção.  
**Repositório:** `oigorbrito/core`. **Área autorizada:** `docs/research/` na branch `research/core-external-evidence-001` (ou worktree de pesquisa explicitamente derivado dela). **Fora de escopo:** mudanças de produção, merge, novas PRs, exclusão de trabalhos históricos, implementação de novo motor.  
**Referências internas prioritárias:** [Inventário original de 29 padrões](harness-study-29-patterns.md); [decisões externas ainda propostas](../decisions/CORE-ADR-001-external-evidence.md). **Não converter 29 padrões em 29 requisitos obrigatórios.**

## 0 — Objetivo e resposta esperada

Responder com evidências: **já existe um motor reutilizável que satisfaz, diretamente ou mediante adaptação pequena e bem delimitada, o conjunto de capacidades e invariantes que buscamos?** Comparar **adotar**, **adaptar** e **construir**; construir apenas se as lacunas/limitações demonstradas justificarem o custo. Nenhum dos candidatos é referência normativa. O ADR anterior é evidência histórica, não veto à descoberta.

**Entrega principal:** matriz por capacidade × candidato × evidência × lacuna × custo verificável de adaptação, acompanhada de shortlist fundamentada e dúvidas explícitas. Não declarar vencedor pelo número de estrelas, LOC, benchmark com modelos diferentes ou marketing.

## 1 — Congelamento factual antes de comparar

1. Registrar data de acesso, URL oficial, licença, release/tag e **SHA completo** do commit estudado para cada candidato. Confirmar se o repo está ativo e se a API pública é documentada; distinguir API pública estável de componente interno.
2. Ler código, testes e documentação **da mesma revisão**; registrar caminhos e símbolos concretos (ex.: caminho:linhas, commit permalink), não somente README. Se fechado/inacessível, registrar **NÃO AUDITÁVEL** sem atribuir resultado positivo ou negativo.
3. Localizar os artefatos históricos `core-02/`, `core-02r/`, `core-03/`, `core-04/` onde de fato existirem. **Não afirmar que estão neste repositório**: o inventário atual em `main` contém um template; solicitar a localização ou descobrir por refs/histórico antes de considerar esses artefatos evidência utilizável.
4. Verificar reprodutibilidade de estudos: metodologia, modelos, orçamento, número de amostras, ablações, controles, dados brutos e limitações. Auditar em separado observação de código, benchmark e inferência.

## 2 — Conjunto inicial de candidatos (não ranking)

- `badlogic/pi-mono`: identificar exatamente os pacotes de engine/SDK e limites de sessão.
- `OpenHands/software-agent-sdk` e, quando indispensável, `OpenHands/OpenHands`: distinguir SDK de servidor/produto.
- `openai/codex`: localizar `codex-core`, API de incorporação, limites do crate e acoplamentos.
- `anomalyco/opencode`: identificar interfaces internas/públicas e custo de extração.
- `langchain-ai/deepagents`: distinguir core, runtime e dependências LangGraph/LangChain.
- `mistralai/mistral-vibe`: separar engine de TUI e conferir estabilidade do contrato.
- `mastra-ai/mastra`: distinguir core de agentes, workflows e serviços.

Incluir outros candidatos somente com **evidência de um SDK/motor reutilizável e hipótese específica de ganho**. Não incluir um produto fechado como implementação auditável só porque possui CLI. Projetos que entregam apenas loop mínimo e não cumprem as capacidades requeridas podem ser casos de referência, mas não receber nota de paridade por simplicidade.

## 3 — Matriz mínima de capacidades verificáveis

Criar um ID estável **C01–C12** para esta auditoria; estes **não** são a contagem científica de 29 padrões.

| ID | Capacidade | Prova exigida para classificar como presente |
|---|---|---|
| C01 | Loop programático | É invocável por API sem UI, com finalização, falha e interrupção observáveis |
| C02 | Provedores/modelos | Troca de backend por contrato público; streaming/tool-calls tipados |
| C03 | Ferramentas | Registro/substituição sem fork do loop; execução e resultados estruturados |
| C04 | Comandos interativos | Steering/follow-up/cancelamento com semântica e limites documentados |
| C05 | Contexto | Orçamento, truncamento sinalizado e política configurável de compactação |
| C06 | Sessões | Criar, persistir, recuperar e identificar causalmente estado do turno |
| C07 | Efeitos externos | Tratamento explícito de operações ambíguas, reconciliação ou limitação documentada |
| C08 | Segurança | Autorização e fronteiras de privilégios independentes da saída do modelo |
| C09 | Concorrência | Semântica de chamadas paralelas e ordenação de resultados especificadas |
| C10 | Extensibilidade | Eventos/hooks/APIs documentadas, com alteração de comportamento sem fork |
| C11 | Observabilidade | Eventos e rastreamento de ferramenta/turno suficientes para diagnóstico |
| C12 | Incorporação | Biblioteca embutível com dependências, plataforma, build e licença identificados |

**Importante:** a matriz C01–C12 é uma **rubrica operacional**, não achado dos 11 harnesses, nem novo escopo funcional obrigatório do produto. A aceitação final das capacidades vem dos requisitos históricos recuperados; registrar divergências na coluna `origem_do_requisito`. Mapear os P01–P29 aos Cxx quando houver nexo, sem forçar correspondência 1:1.

Por célula, usar: `CONFIRMADO_CODIGO`, `CONFIRMADO_TESTE_UPSTREAM`, `DOCUMENTADO`, `PARCIAL`, `AUSENTE_COMPROVADO`, `NÃO_VERIFICADO`, `NÃO_AUDITÁVEL`. Nunca converter `NÃO_VERIFICADO` em `AUSENTE`.

## 4 — Protocolo de prova por candidato

Para cada Cxx: identificar **arquivo, símbolo, commit, linha, teste upstream, documentação e limitação**. Confirmar **caminho de execução real** da API até o efeito: uma interface declarada e não conectada ao runtime não constitui capacidade pronta.

Quando houver incompatibilidade, diferenciar:
- **Configuração:** funcionalidade existente só requer opções.
- **Extensão pública:** plugin/adapter sem fork do core.
- **Patch contido:** alteração localizada e delimitada de engine.
- **Fork estrutural:** mudanças em invariantes ou múltiplos componentes centrais.
- **Não demonstrado:** falta de informação ou código.

O custo de adaptação deve registrar arquivos/símbolos afetados, dependências, APIs internas envolvidas, política de atualizações upstream, novas invariantes e riscos. Não inventar estimativa em pessoa-hora, porcentagem ou LOC sem medição.

## 5 — Fontes e comparação de evidência

A leitura obrigatória começa pelas fontes externas versionadas do ADR D01–D08 e pelo estudo de 11 sistemas (29 padrões). Complementar com artigos e issues upstream *apenas para resolver lacunas específicas*.

Para benchmarks externos, registrar sempre **mesmo modelo? mesma versão? mesmas tarefas? mesmo ambiente? mesmo limite de tokens/custo? mesmas ferramentas? N e variância disponíveis?** Se não, classificar como indício, nunca ranking causal de motores.

O estudo de 11 sistemas é auditoria de código, **não** 11 ensaios controlados. Não repetir a contagem arbitrária de 20 itens. Os 29 são o catálogo imutável daquele artigo; C01–C12 é só indexação operacional desta inspeção.

## 6 — Arquivos exatos de entrega

Produzir ou atualizar, na área de pesquisa:
- `docs/research/reuse-candidate-locks.md` — URLs, SHAs, licenças, versões e disponibilidade de código.
- `docs/research/reuse-capability-matrix.md` — C01–C12 × candidatos, status e links para provas específicas; incluir `origem_do_requisito`.
- `docs/research/reuse-gaps-and-costs.md` — funcionalidades ausentes, meio de adaptação, riscos e dependências.
- `docs/research/reuse-evidence-ledger.md` — afirmação atômica, classe de evidência, fonte com permalink, contraprovas e limitações.
- `docs/research/reuse-decision.md` — conclusões condicionadas: adotar / adaptar / construir; explicitar itens não demonstrados.

Não produzir dezenas de arquivos auxiliares nem abrir PR por microentrega. Continuar na branch de pesquisa, sem merge automático.

## 7 — Sequência e condição de parada

1. Inspecionar e reconciliar histórico e fontes; congelar revisões.
2. Preencher a matriz para todos os candidatos, admitindo `NÃO_VERIFICADO` quando faltar prova.
3. Investigar prioritariamente as **lacunas que distinguem alternativas** (ex.: embutibilidade, controle interativo, efeitos incertos, autorizações, extensões) antes de aprofundar recursos que todos já possuem.
4. Reduzir a shortlist **somente** por evidência de incapacidade, custo de fork, acoplamento ou cobertura insuficiente; registrar eliminados com justificativa.
5. Encerrar quando houver decisão comparável, com conjunto explícito de requisitos atendidos, lacunas e caminhos de adaptação. Se nenhum candidato vencer de modo defensável, relatar empate/insuficiência e exatamente a prova faltante; **não fabricar ranking**.

**Proibições:** nenhuma alteração em `main`, nenhuma implementação do motor, nenhuma execução paga, nenhuma instalação destrutiva, nenhuma remoção de histórico e nenhum merge. Analisar primeiro, decidir depois. Atualizações de documentação nessa branch não representam autorização de incorporação.
