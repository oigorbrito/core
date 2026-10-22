# CORE-SHELL-001 — Comparação defensável do shell Pi × Orca

Status: `PROTOCOL_ONLY` até os dois executores **reais** rodarem os mesmos casos. A verificação `shell_host_baseline.py` só qualifica o ambiente do processo supervisor, **não comprova** capacidade, velocidade ou superioridade de qualquer core.

## Experimento que decide

Usar os dois motores upstream em SHAs fixos com sua API pública de ferramentas shell, sem modelos LLM ou mocks **para medir a execução da ferramenta real** (casos não disponibilizados pela API devem ser `NOT_TESTED`). Mesmo runner, SO, diretório isolado, comando, limites, warmups e ordem alternada AB/BA. Guardar execução bruta com timestamps monotônicos, exit code, stdout/stderr, diffs de arquivos e revisão/binários.

Matriz de validade: saída+stderr, exit code não zero, argumento com metacaracteres sem interpretação acidental, caminhos Unicode e espaços, isolamento de cwd, cancelamento de processo e descendentes, timeout, escrita/leitura, paralelismo e serialização de duas escritas no mesmo arquivo, uso de RAM/CPU. Validar por oracle externo independente, não confiar no auto-relato do agente. Usar casos idênticos quando possível e registrar diferenças de semântica ou permissão.

Performance: >= 30 repetições por candidato para microbenchmarks e pelo menos 5 blocos de ordem AB/BA; excluir setup/compilação, mas **não** o custo do shell por execução. Comparar mediana, p95, razão e distribuição pareada, com intervalos e ambiente. Priorizar tempo de ponta a ponta e correção de efeitos, não só spawn. Um teste que falha sem equivalência de ferramentas não autoriza declarar perdedor.

Invariantes de segurança: nenhum comando perigoso; usar diretório temporário e limites; nunca shell=True com entrada não confiável; encerrar árvore inteira; evitar correr testes concorrentes em áreas compartilhadas.

Três gates independentes: (A) semântica e oracle, (B) latência/custo de recursos, (C) cancelamento, concorrência e efeitos no filesystem. Só emitir `CORE_COMPARABLE` após adaptadores reais, não por scripts de processo hospedeiro. Nenhuma API paga.
