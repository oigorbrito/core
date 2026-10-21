# CORE-ADR-001 — Decisões fundamentadas por evidências externas

**Estado:** PROPOSTO PARA REVISÃO (não aprovado como superioridade empírica do motor).  
**Data:** 2026-10-20.  
**Repositório-base:** `oigorbrito/core`, `main@9bdd3e1c4fdfe61f2e7e8f79052fa5d846693a18`.  
**Escopo:** motor/harness extensível de agente de programação, independente de produto e interface.  
**Política:** estudo externo não substitui validação local, e baseline de benchmark não equivale a prova de mecanismo.

## Escala de evidência usada

- **E1 — estudo com comparação controlada/ablação:** efeito observado no escopo específico, não generalização universal.
- **E2 — auditoria de implementações:** demonstra uso ou desenho recorrente; **não** prova superioridade.
- **E3 — relatório de benchmark/caso comunitário:** sinal exploratório, especialmente se N pequeno.
- **R — decisão de engenharia:** inferência a partir de invariantes do produto/segurança; não se faz passar por medição externa.

## Decisões de mecanismos

| ID | Capacidade | Decisão para o desenho inicial | Fundamento | Confiança e limite |
|---|---|---|---|---|
| D01 | Loop | **Loop assíncrono explícito, independente de UI, com ciclo modelo→tool→observação→modelo e terminações observáveis.** Não adotar framework genérico como dependência obrigatória. | [S1] compara onze implementações reais; nenhum usa framework agente genérico como runtime central. | E2: recorrência, sem evidência de superioridade de performance. |
| D02 | Contexto | **Política de remoção determinística de observações redundantes antes de sumarização por LLM**, sob limite variável por modelo. Preservar a proveniência do conteúdo removido e tratar overflow reativamente com tentativas limitadas. | [S2] compara 176 configurações em quatro modelos e duas famílias de benchmark; [S3] mede 169 tarefas sob janela restrita. | E1: benefício depende do orçamento de contexto; reversibilidade por recuperação de texto não demonstrou benefício geral em [S2]. |
| D03 | Espaço de ferramentas | **Ferramentas especializadas são capacidades opcionais e substituíveis; shell não é o único mecanismo obrigatório de edição.** Permitir ambos por contrato de ferramenta, sem duplicar autorização. | [S2] encontra diferenças dependentes de proficiência em Bash e natureza das tarefas. | E1: escolha adaptativa ainda não tem regra ótima universal. |
| D04 | Tratamento de estagnação | **Sinalizar progresso ausente com telemetria observável, impor orçamento finito e produzir pausa/falha explícita;** não abortar só porque um hash idêntico apareceu três vezes. | [S3] mostra ganhos de tratamento conjunto de contexto e repetição; não isola causalmente um algoritmo de detecção por hash. | E1 para tratamento combinado; R para política concreta. |
| D05 | Interação | **Expor comandos de steering, follow-up e cancelamento com semântica documentada**; interrupções respeitam fronteiras de efeitos externos e cancelamento não depende de interpretação pelo modelo. | [S1] cataloga subsistemas de harnesses e diferenças de controle. | E2/R: não há comparação independente que torne uma fila específica obrigatória. |
| D06 | Segurança | **A autorização é independente da sugestão do LLM; ferramentas, hooks e extensões não ganham privilégios implícitos.** Registrar identidade/versionamento e escopo dos componentes. | [S4] analisa 3.171 repositórios de configuração, identificando classes verificadas de permissões amplas e componentes MCP sem versão fixa. | Evidência observacional de riscos, não ensaio de arquitetura de sandbox; desenho do controle é R. |
| D07 | Estado durável | **Persistir comandos, intenções de efeitos e resultados com causalidade explícita; em resultado externo incerto, reconciliar antes de repetir.** Backend (SQLite, JSONL, checkpoint) é decisão separada. | R: propriedade de consistência e efeitos colaterais, sem estudo comparativo externo localizado que selecione banco vencedor. | Requisito arquitetural, não superioridade empírica. |
| D08 | Extensibilidade | **Interfaces públicas versionadas para provedor, ferramentas, eventos e controle;** extensões não devem exigir alteração do loop. | [S1] identifica harness como plataforma com superfícies de extensão. | E2/R: precisa de teste de substituição para validar utilidade. |

## Decisões que NÃO são sustentadas como vencedoras

1. **SQLite contra JSONL/checkpoints:** escolha inicial possível por transações, mas o estudo citado não demonstra superioridade de desempenho ou recuperação neste core.
2. **Reducer puro e single-writer por sessão:** mecanismos plausíveis de consistência; não decorrem automaticamente dos benchmarks citados.
3. **Middlewares universais versus callbacks simples:** nenhuma superioridade geral demonstrada; preferir a menor superfície que satisfaça os contratos.
4. **Números mágicos:** 25.000 caracteres, 30% de histórico, três repetições, 500–1.000 linhas não são parâmetros empiricamente universais.
5. **Desempenho de um agente completo como prova do core:** controlar modelo, tarefas, ferramentas, orçamento, prompts, ambiente e versão antes de atribuir causalidade ao harness.
6. **SWE-bench Verified como medida definitiva:** [S5] identifica contaminação e problemas de testes; não usar isoladamente para reivindicações de fronteira.

## Limites que a implementação deverá respeitar

- Eventos devem possuir identidade de sessão, de operação e de relação causal verificáveis.
- Chamadas concorrentes de ferramentas não podem introduzir reordenação silenciosa de efeitos; ordenação e independência devem ser especificadas.
- O retorno do modelo, o sucesso do comando, a verificação e a aceitação são estados distintos.
- A política de compactação não pode silenciosamente eliminar decisões, permissões ou informações ainda necessárias.
- Toda saída consumida pelo LLM deve ter limites e indicação de corte, preservando evidência original quando permitido e necessário.
- Operações externas irreversíveis ou não idempotentes nunca devem ser repetidas automaticamente após falha de estado incerto.
- Alterações arquiteturais futuras requerem problema, referência adequada, custo e critério de refutação.

## Fontes e natureza da evidência

- **[S1]** Barbaste et al., *Harness Engineering: Anatomy, Architecture, and Evolution of Coding Agents — A Source-Code Study of Eleven Systems* (2026). https://arxiv.org/abs/2609.00006 . **Auditoria de código**, não comparação experimental de qualidade.
- **[S2]** Fan et al., *An Empirical Study of Harness Design for Coding Agents* (2026). https://arxiv.org/abs/2609.20804 . **176 configurações pareadas**, quatro modelos, SWE-bench Verified e Terminal-Bench 2.1; estuda planejamento, ferramentas e contexto.
- **[S3]** Lewis, *Same Model, Different Harness: Different Coding-Agent Results* (2026). https://arxiv.org/abs/2608.26218 . Comparação de tratamento combinado; **43→72 soluções completas em 169 tarefas** sob pressão de contexto; não atribuir benefício isolado a stuck detection.
- **[S4]** Kapner et al., *Scanning the Harness: An Empirical Study of Supply-Chain Defects in AI Coding-Agent Configurations* (2026). https://arxiv.org/abs/2609.07360 . Estudo observacional de 3.171 repositórios, não teste de políticas de runtime.
- **[S5]** OpenAI, *Why we no longer evaluate SWE-bench Verified* (23 fev. 2026). https://openai.com/index/why-we-no-longer-evaluate-swe-bench-verified/ . Análise das limitações do conjunto de avaliação.
- **[S6]** *Same Model, Different Harness* (benchmark comunitário). https://github.com/d1-m4ss/harness-benchmark . Demonstra variação de custo/latência com mesmo modelo em amostras pequenas; **não** classifica arquitetura universalmente.

## Situação e próxima ação

Estas são **decisões para especificação**, não implementação comprovada. Antes de transformar em código, revisar este ADR contra contratos existentes, congelar o SHA do conteúdo aprovado e definir APIs mínimas para: loop, controle, contexto, ferramentas, provedor, eventos e durabilidade. Não foi executado benchmark local nem alterado código de produção.

**Merge permanece manual.**
