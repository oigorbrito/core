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
