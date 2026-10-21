# CORE — esqueleto arquitetural experimental

O esqueleto **não escolhe motor, linguagem definitiva nem donor**. É uma fronteira de incorporação mínima para aferir candidatos usando contratos públicos e testes determinísticos. O único loop executável de referência permanece em [reference/core.mjs](../reference/core.mjs); não duplicá-lo aqui.

## Componentes

- `contracts.mjs`: valida as portas necessárias (engine, políticas, registro de eventos).
- `host.mjs`: coordena execução, prevenção de chamadas concorrentes na mesma instância e isolamento de callbacks.
- `adapters/reference-engine.mjs`: conecta temporariamente o loop de referência ao contrato comum; **não é motor escolhido**.
- `adapters/memory-journal.mjs`: somente testes, não persistente.
- `test/skeleton.test.mjs`: suíte reproduzível sem rede ou APIs pagas.

## Fluxo

```text
Cliente (CLI, desktop, IDE)
    │  run(task, signal, onEvent)
    ▼
Host  ── autorização obrigatória / journal
    │
    ▼
EngineAdapter ◄── donor selecionado por testes futuros
    │
    ├── ModelPort
    ├── ToolPort
    └── EventPort
```

O contrato só exige comportamento mínimo e **não prescreve arquitetura interna ao donor**. As portas são dependências explícitas e podem ser implementadas pela API pública de qualquer candidato.

## Como executar

Requer Node 22+; sem `npm install`:
```powershell
node --test .\reference\test\core.test.mjs .\skeleton\test\skeleton.test.mjs
```

## Limites / gates não atendidos

- Sem execução de repositório real, benchmark comparativo, sandbox nativo, isolamento de processos ou executor de shell.
- Journal em memória perde eventos quando o processo encerra; não oferece retomada, idempotência, transações ou *exactly-once*.
- Os contratos são hipóteses de integração; **não são equivalentes aos 29 padrões nem atestam as 18 recomendações**. Tais rastreios permanecem em `docs/research`.
- O host evita corrida de chamadas na mesma instância, mas não garante sincronização distribuída.
- `run` é a única capacidade exigida no contrato inicial; steering, follow-up e recovery são capacidades opcionais do motor, a serem comprovadas antes de incorporá-las na API.
- Nenhuma suíte local deste esqueleto havia sido executada quando os arquivos foram publicados no GitHub; verificar antes de declarar PASS.

Critério para o primeiro donor: atender o contrato por adaptador público, sem fork; depois demonstrar ferramentas reais, permissões, recuperação e resultados em tarefas verificadas.
