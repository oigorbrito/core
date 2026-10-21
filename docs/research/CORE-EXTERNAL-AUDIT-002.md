# CORE-EXTERNAL-AUDIT-002 — auditoria de fontes e limites de inferência

**Data:** 2026-10-21. **Tipo:** auditoria documental e inspeção de arquivos públicos por API GitHub; **não** houve reprodução, benchmark próprio, clone de todos os donors, nem classificação de motor vencedor.

## Fontes com evidência inspecionada

### 1. Comparação mesmo modelo, harnesses diferentes

Repositório: https://github.com/rajshah4/harness-benchmark

**Arquivos efetivamente lidos e respectivos SHA de blob Git** (os valores abaixo **não são SHAs de commit do repositório**):

| Arquivo | Blob SHA |
|---|---|
| `METHODOLOGY.md` | `1e5117c0ce339b26b944ff0ef32d00ec7e87c2fe` |
| `REPLICATION-CAVEATS.md` | `f01e94a19f7922e8bb1c509daebd399cb3a6c14d` |
| `README.md` | `6081b138f2b22ff7abe54e7f10a95ba0c80b891e` |
| `results/short-suite.md` | `0f406d5e5de0457727581cb1829db5d6d5750f02` |
| `results/medium-project-token-differences.md` | `54f6171141843a73e569791f5bced545e032e8ad` |
| `results/incident-repeat-trials.md` | `97ff31c1c8e8b4b396d5f3d3fefd8450870cdbb2` |
| `results/current-main-calibration.md` | `a24f977d5bc2d6bcd8b5115f31451a9b9515ff5a` |

**Método declarado:** GLM-5.2, mesmo provedor, ambiente, prompt, árvore inicial, permissões, timeout e verificador externo; OpenHands nativo vs outros harnesses por ACP; Codex separado quando usando modelo diferente. Provider ledger registra tokens e cache. `METHODOLOGY.md` recomenda ao menos três repetições por tarefa/harness para uma conclusão mais forte.

**Observações documentadas** (dados de terceiros, não do CORE):

| Experimento | OpenHands | OpenCode | Interpretação |
|---|---|---|---|
| Oito tarefas curtas, GLM-5.2 | 8/8, 1140,8 s, US$1,2489 | 8/8, 838,6 s, US$0,5711 | Empate em correção; OpenCode mais econômico nesta amostra, não prova universal |
| Dois projetos médios, GLM-5.2 | 1/2, 782 s, US$0,725 | 2/2, 738 s, US$0,480 | Amostra insuficiente para rank robusto |
| Projeto longo incidente, GLM-5.2 | comportamento especificado passou, interpretação do verificador corrigida | 8/8 (ajustado ao contrato), 17m40s, US$0,768 | Comparação condicionada a critérios e ressalvas do autor |
| Projeto incidente Sonnet 4.5 | 7/8, 12m24s | 6/8, 15m52s | **A ordem de qualidade muda com o modelo** |
| Calibração 12 combinações (4 harnesses × 3 modelos) | Validada segundo o autor | Validada segundo o autor | **Calibração é gate de telemetria**, não benchmark de qualidade |

O autor atribui grande parte das diferenças de custo a quantidades distintas de schemas de ferramentas enviados em cada chamada e ao número de chamadas. **Esta é uma hipótese explicativa documentada pelo experimento, não um resultado transferível para toda tarefa.**

**Limites críticos:**
- Uma execução por tarefa/harness nos experimentos principais; escala insuficiente para certeza estatística.
- O relatório registra problemas de verificador e correções de interpretação; ler resultados brutos antes de extrair taxa de sucesso.
- Telemetria de interfaces difere dos dados do provedor; não substituir dados ausentes por zero.
- Os resultados medem harnesses **completos** e não a qualidade isolada de `core`/SDK. Não justificam escolha direta de biblioteca nem linguagem.
- Ainda **não foram auditados individualmente** cada JSON bruto, ledger, trace e hash de fixture. A expressão “reproduzível” no README não prova reprodução independente.

### 2. Harness-Bench (Qihoo360)

Repositório: https://github.com/Qihoo360/harness-bench

Arquivo efetivamente lido: `README.md` (blob `75fc49c2093ed8ce583e48865b73d0c95d96c2c4`). O README descreve **300 tarefas offline** (274 gerais + 26 multimodais), **1.408 módulos pontuáveis**, envelopes isolados e graders por oráculo. Aponta verificadores de arquivos de bloqueio da suíte e validadores dos oráculos.

**Pontos comprovados nesta revisão:** existe infraestrutura explicitamente destinada a controlar tarefas/ambiente/verificação. **Ainda não foram** inspecionados executores, resultados individuais, comparações motor×modelo, hashes completos de fixture nem reexecutados graders. Não converter esse catálogo em ranking de compatibilidade de cores; a distribuição inclui tarefas multimodais e fluxos generalistas.

## Estado auditável (sem resultados inventados)

| Verificação | Estado |
|---|---|
| Acesso a metodologia, ressalvas e relatórios públicos | CONFIRMADO (blobs listados) |
| Presença de avaliações por tarefa e ledger em árvore publicada | DOCUMENTADO, integridade não auditada neste bloco |
| Fixação do SHA **commit** de ambos os benchmarks | PENDENTE |
| Auditoria de cada run JSON e correspondência com ledger | PENDENTE |
| Reexecução independente de benchmark | NÃO REALIZADA |
| Comparação estrita do núcleo isolado | NÃO REALIZADA |
| Motor tecnicamente superior por evidência | INDETERMINADO |

## Decisão de arquitetura sem favoritismo

**Não escolher motor por placar de harness completo.** O candidato deverá demonstrar API pública incorporável, dependências do core isolado, políticas/controle, estado recuperável e custo de refatoração. A avaliação externa reduz testes redundantes de harness, mas não substitui auditoria de incorporação. Não criar novo loop operacional em paralelo com donors.

## Próximo gate substantivo

1. Fixar commit completo do repositório benchmark e identificar os `results/raw` e `provider-ledgers` correspondentes às tarefas controladas.
2. Fazer verificação cruzada task-ID ↔ status de oráculo ↔ provider ledger ↔ modelo ↔ contexto de ferramentas. Reportar conflitos sem corrigi-los silenciosamente.
3. Auditar custo de incorporação do núcleo dos donors pelos SHAs reais das bibliotecas; manter **B1/B2 suspensos** enquanto a evidência externa pertinente não for aproveitada.

**Não houve CI, merge, PR ou benchmark próprio neste trabalho.** M1–M5 permanecem 0/5 aceitos.
