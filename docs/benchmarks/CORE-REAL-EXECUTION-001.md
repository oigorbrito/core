# CORE-REAL-EXECUTION-001 — executar Pi × Orca agora (Codex local)

Executor: Codex no Windows, no checkout `D:\\projetos\\core` ou localizar `oigorbrito/core`. Este é **um trabalho substantivo completo**, não uma sequência de perguntas. Continue autonomamente até obter um gate reproduzível ou um bloqueio material demonstrado. Não abrir novo protocolo nem fazer auditoria genérica.

## Alvo fechado

Produzir dados de **tarefas reais de programação** pareadas de Pi 1.3.0 e Orca Harness, com o mesmo Ollama local e modelo/digest, medindo (A) tokens provider-reported, (B) tempo wall end-to-end e (C) correção por oracle externo, e gravar registros brutos. Proibidas chamadas pagas, roteamento cloud e fallback remoto. Usar `docs/benchmarks/CORE-BENCH-REAL-001.md`; corrigir lacunas instrumentais existentes em vez de aceitar medições falsas.

## Execução autorizada

1. Verificar repo/branch/HEAD, worktree limpo ou preservar alterações em worktree separado; deixar `main` intacta. Ler `bench/real-task/preflight.py`, `bench/real-task/analyze.mjs` e testes existentes. Fixar SHAs de Pi e Orca e registrar versões/compiladores/hardware; compilar Orca uma vez. Não reexecutar homologações de integridade já aprovadas.
2. Verificar serviço Ollama no `127.0.0.1:11434`, inventariar modelos e digests disponíveis. Preferir modelo **já presente** com suporte real a `tool_calls`; não presumir que modelos anteriormente reprovados agora funcionam. Se nenhum existir, selecionar candidato oficialmente compatível com chamada estruturada e registrar download/armazenamento necessário; não consumir serviço externo. Usar o preflight 3/3. Não prosseguir para atribuição de vitória se elegibilidade não ocorrer.
3. Validar rotas oficiais locais de ambos os cores. Orca upstream declara Ollama padrão `http://localhost:11434/v1` sem chave; Pi deve ser configurado para endpoint local pela API/CLI suportada na versão fixada. Nunca editar upstream para contornar contrato de `tool_calls` ou transformar JSON textual em chamada de ferramenta. Se mesma configuração não existir, emitir `PAIR_INELIGIBLE` com logs precisos, não inventar resultado.
4. Criar runner com execução pareada AB/BA; uma única inferência por vez no backend; separar aquecimento; sandbox/workspace fresco para cada tentativa; modelo/temperature/contexto/budgets idênticos; três tarefas de programação com testes independentes preselecionados. Usar como inspiração as fixtures `benchmarks/harness-comparison` do Orca, mas **não executar** `run.py` diretamente: ele fixa OpenRouter. Sem `OPENROUTER_API_KEY`, `ANTHROPIC_API_KEY`, `OPENAI_API_KEY` nem fallback pago.
5. Fazer piloto 3 tarefas × 5 repetições × 2 cores, quando elegibilidade e orçamento local permitem. Interceptar requests/responses localmente para contar usage reportado pelo **mesmo Ollama**; coletar token totals por tentativa incluindo falhas, tempos monotônicos, revisões, mudanças, execução do oracle externo, arquivos raw JSONL e hashes. Se contador ausente, `null`, nunca converter bytes em tokens. Dispersão e denominadores completos, inclusive falhas/timeouts.
6. Alimentar os três gates `node bench/real-task/analyze.mjs consumption|speed|efficacy <results-dir>`. Fortalecer validadores se necessário (somas por requisição, status e prova de oracle, hashes e ausência de endpoints remotos). Executar testes de unidade e CI barato sem compilações redundantes; logs brutos e resumo `docs/benchmarks`. Gate e decisão sem alegar superioridade estatística com apenas cinco repetições por tarefa.
7. Commitar somente branch experimental; PR opcional **sem merge automático**. Não solicitar confirmação entre etapas já autorizadas. Em caso de bloqueio material: documentar reproducer, tentar alternativa tecnicamente suportada, e finalizar com causas concretas, sem fingir PASS.

## Relatório obrigatório

Registrar SHA de commit e donor, comando integral, runner, modelo/digest, versão Ollama, cada tarefa/oracle e resultado, contagem de tentativas, total de tokens de entrada/saída, duração por tentativa e custo de recursos por tarefa correta; rastros completos e checksums. Declarar `PILOT_INCONCLUSIVE` quando a evidência não sustentar seleção, ainda que um candidato tenha ganho local. Não usar métricas de loop simulado como custo de tarefa real.

Este prompt já autoriza **implementar, testar, corrigir e repetir ensaios falhos quando justificável**; não precisa devolver o trabalho a cada passo.



## Addendum — desbloqueio concreto após preflight local 3/3

Relato do executor local: `gpt-oss:20b` passou 3/3 chamadas estruturadas; resultado não significa que Pi e Orca estejam pareados. Na próxima execução, **não repetir o preflight do modelo sem necessidade**.

O repositório donor `https://github.com/okikorg/orca-harness` já publica o material de benchmark em `benchmarks/harness-comparison/fixture/` e `tasks.json`:

- `fix-retry-boundary`: altera `src/retry.rs`, bug `attempts_made <= max_attempts`; oracle comportamental deve testar fronteiras com um pequeno teste Rust isolado, não somente grep.
- `fix-worker-heartbeat`: altera `config/worker.yaml` conforme `docs/workers.md`; oracle independente deve validar parsing/config e invariantes, não somente ocorrência textual.
- Terceira tarefa: selecionar antes da execução outro defeito de código/config real de repositório publicamente congelado, com teste independente de comportamento, para não inventar um defeito a posteriori. A seleção, o fixture e o oracle deverão ser versionados com hashes antes dos trials. Se não houver terceira tarefa suficientemente comprovada, execute piloto com duas tarefas e registre denominador reduzido sem alegar superioridade.

Passos mandatórios e autorizados:
1. No Windows, obter donor: `git clone https://github.com/okikorg/orca-harness.git` num diretório isolado, registrar `git rev-parse HEAD`, manter commit fixo durante todo ensaio; `cargo build --release --locked -p orcacode` uma única vez.
2. Copiar apenas a fixture comprovada e os metadados congelados para diretório próprio de resultados, registrar SHA256. Não depender de arquivos que ainda não estão no checkout de `oigorbrito/core`: são fornecidos pelo donor clonado.
3. Reutilizar a ideia de isolamento e ordenação do `benchmarks/harness-comparison/run.py`, mas **não o chamar**: ele fixa OpenRouter tanto em Orca como Pi.
4. Construir caminho local de inferência só por API oficial de cada candidato e provar igualdade de modelo, digest e endpoint. Reusar o preflight 3/3 já aprovado; não alterar oráculos para melhorar métricas. Se caminho Pi/OpenAI-compatível incompatível, relatar o ponto exato e ajustar configuração por contrato público, sem fake tool_calls.
5. Rodar tarefas de edição reais, não apenas a medição de overhead. Reproduzir e documentar passos de oracle externo após a execução, colecionar usage do backend e tempo monotônico, inclusive falhas.
6. Publicar os resultados e análise dos três gates ou um bloqueio reproduzível específico. Não prolongar estudo arquitetural, não descartar o donor por ausência inicial no checkout.

Nota de fidelidade: os checks de texto do donor **não bastam** como oracle de correção; é obrigatório teste externo sem depender das declarações do agente.



## Adendo 2026-10-21 — Dataset real oficial; resolver DATASET_BLOCKED

Novo relato local confirma Orca v0.9.0 SHA `4b74788005b081ce97418361f85e97a338c8d433`, Pi 1.3.0, Ollama `gpt-oss:20b` digest `f38aa0c53da5f8c49d08c43a99df24ff53167fe68e24664a7777288e7656fdfe`, tool calls 3/3. Não reconstruir/baixar outra vez sem necessidade. O local reportou `PAIR_INELIGIBLE` por dataset ausente: **reclassificar DATASET_BLOCKED**, porque nenhuma incompatibilidade de adapters foi demonstrada.

Para evitar fixtures inventadas, utilizar `SWE-bench/SWE-bench_Verified` como dataset real. Referências oficiais: `https://www.swebench.com/SWE-bench/guides/datasets/` e `https://huggingface.co/datasets/SWE-bench/SWE-bench_Verified`. O dataset contém `instance_id`, `repo`, `base_commit`, `problem_statement`, `test_patch`, `FAIL_TO_PASS` e `PASS_TO_PASS`; o avaliador oficial executa testes em Docker. **Não exibir `patch` gold ao agente.** Fixar snapshot/revision do dataset, SHA de instância, base_commit, imagem de avaliação e oracle antes das tentativas. Validar previamente que os testes FAIL_TO_PASS falham no baseline e passam com patch ouro, em isolamento; isso é qualificação do dataset, não vitória de agente.

Seleção pré-declarada, sem cherry-picking posterior: filtrar instâncias pela disponibilidade Docker/Windows WSL2 e capacidade de rodar o oracle, ordenar `instance_id` lexicalmente e escolher as primeiras 3 válidas **antes** de qualquer execução Pi/Orca. Arquivar lista integral de elegíveis/rejeitados com razão objetiva, hashes, identificadores e logs. Se dependências pesadas impedirem 3, começar com 1 válida para um piloto instrumental e depois expandir para 3; não declarar superioridade.

Executar em Linux/WSL2 quando necessário para garantir avaliação SWE-bench oficial. Dois agentes recebem a mesma descrição do issue, checkout base e mesmo orçamento. Usar a mesma sequência pareada AB/BA. Materializar trace de chamadas e usage do Ollama; validar os adaptadores ao endpoint local antes de trials. Oracles rodam **fora** do agente. Manter 5 repetições por candidato/instância quando recursos permitirem.

O upstream da ferramenta de benchmark é `https://github.com/swe-bench/SWE-bench`; preferir seu avaliador oficial a testes locais ad hoc. Se dataset oficial não for alcançável, registrar erro de acesso específico, não afirmar que faltam tarefas reais em geral.
