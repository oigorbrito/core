# Inventário primário — 29 padrões do estudo de 11 harnesses

**Fonte primária exata:** Barbaste et al., *Harness Engineering: Anatomy, Architecture, and Evolution of Coding Agents*, arXiv:2609.00006v1, §13.1, Tabelas 11 e 12: https://arxiv.org/html/2609.00006v1#S13.SS1

**Semântica dos números:** 11 sistemas auditados em código-fonte; 7 subsistemas; 29 padrões catalogados (17 da edição de abril mais 12 da expansão de julho); 13 observações transversais; 18 recomendações. **Não são 11 testes controlados, 29 funcionalidades obrigatórias ou 29 benchmarks.** O próprio artigo declara que não faz benchmark nem ranking.

**Inventário fixo do artigo** (tradução e agrupamento são análises posteriores, não parte desta enumeração):

| ID | Nome original no estudo | Situação de decisão para o nosso core |
|---|---|---|
| P01 | Event Sourcing | A avaliar, sem adoção automática |
| P02 | Policy-as-Code | A avaliar, sem adoção automática |
| P03 | Recursive Composition | A avaliar, sem adoção automática |
| P04 | Polymorphic Edits | A avaliar, sem adoção automática |
| P05 | Deferred Loading | A avaliar, sem adoção automática |
| P06 | Template Method | A avaliar, sem adoção automática |
| P07 | Protocol Interfaces | A avaliar, sem adoção automática |
| P08 | LLM Summarization | A avaliar, sem adoção automática |
| P09 | Stuck Detection | A avaliar, sem adoção automática |
| P10 | Reflection Loop | A avaliar, sem adoção automática |
| P11 | Prompt Caching | A avaliar, sem adoção automática |
| P12 | Context Forking | A avaliar, sem adoção automática |
| P13 | Middleware Pipeline | A avaliar, sem adoção automática |
| P14 | JIT Repo Context | A avaliar, sem adoção automática |
| P15 | Skills (capability bundles) | A avaliar, sem adoção automática |
| P16 | Conditional Activation | A avaliar, sem adoção automática |
| P17 | Turn-Level Checkpoint | A avaliar, sem adoção automática |
| P18 | Agent-Maintained Memory | A avaliar, sem adoção automática |
| P19 | Outer Verification Loop | A avaliar, sem adoção automática |
| P20 | Self-Improving Skill Loop | A avaliar, sem adoção automática |
| P21 | Lineage Compaction | A avaliar, sem adoção automática |
| P22 | Session-Tree Version Control | A avaliar, sem adoção automática |
| P23 | Minimal-Core / Extension-Host | A avaliar, sem adoção automática |
| P24 | Client/Server Harness | A avaliar, sem adoção automática |
| P25 | Model-Family Prompt Matrix | A avaliar, sem adoção automática |
| P26 | Cache-Dialect Fanout | A avaliar, sem adoção automática |
| P27 | Syntax-Aware Command Permissioning | A avaliar, sem adoção automática |
| P28 | Untrusted-Content Delimiting | A avaliar, sem adoção automática |
| P29 | Harness Mimicry | A avaliar, sem adoção automática |

## Como pesquisar sem falsificar o denominador

1. Cada ID P01–P29 deve manter nomenclatura e referência à linha da tabela-fonte, sistemas que o usam, mecanismo, risco, requisitos atendidos, evidência independente, alternativa e decisão final.
2. A unidade **padrão identificado no estudo** não é intercambiável com capacidades, testes ou módulos. Não converter automaticamente "8 decisões" anteriores em "8/29 concluídos".
3. As categorias D1–D7 são loop, integração LLM, ferramentas, memória/contexto, segurança/permissões, orquestração e extensibilidade. Interface e substrato de sessões são transversais, não novos subsistemas no artigo.
4. Estudos experimentais externos devem ser analisados individualmente quanto a modelo, tarefa, controle de variáveis, número de execuções e escopo de generalização. Auditoria de código não prova desempenho.
5. Não privilegiar o Pi ou o ADR anterior; decisões D01–D08 da PR #1 continuam hipóteses/decisões rastreáveis e exigem mapeamento explícito para os padrões, não contagem presumida.
6. P29 descreve imitação de identidade de outro harness para uso de infraestrutura OAuth; catalogar como observação do artigo, não recomendação de implementação.
7. Novas evidências podem acrescentar linhas a um **inventário suplementar com fonte distinta**, sem alterar os 29 padrões da publicação.
8. **Estado inicial verificável:** 29/29 padrões transcritos; 0/29 decisões individuais demonstradas e revisadas. Transcrição não é investigação concluída.
