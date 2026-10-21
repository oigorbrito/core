# CORE-REUSE-01 — Resultado de execução reportado pelo operador

**Ambiente informado:** Windows PowerShell, `D:\projetos\core-reuse-01\experiments\engine-embed`.  
**Origem da evidência:** transcrição de saída de terminal enviada no chat. Não houve acesso remoto ao ambiente Windows nem verificação independente de integridade do log.  
**Pacote:** `@earendil-works/pi-agent-core@1.3.0`; script `smoke.mjs` do experimento.

## Saída observada (dados enviados pelo operador)

```json
{
  "status": "PASS",
  "scenario": "embedded-engine-offline-tool-cycle",
  "requests": 2,
  "approvals": 1,
  "executed": ["probe-ok"],
  "eventCount": 16,
  "upstreamPackage": "@earendil-works/pi-agent-core@1.3.0"
}
```

`npm install --ignore-scripts --no-audit --no-fund`: 86 pacotes instalados; aviso não bloqueante de depreciação `node-domexception@1.0.0`. `npm run smoke`: código de saída aceito pelo PowerShell, script exibiu PASS.

## O que esta evidência comprova no cenário executado

- A instalação local resolveu as dependências do protótipo.
- A API embutida executou um turno inicial de modelo simulado que solicitou uma ferramenta e um segundo turno que concluiu.
- O hook de preflight foi acionado uma vez.
- A ferramenta local `echo` executou uma vez com argumento esperado.
- Foram recebidos 16 eventos, incluindo encerramento.
- Nenhum provedor externo pago foi necessário.

## O que NÃO comprova

- Equivalência completa do core a outros agentes.
- Persistência de sessões e recuperação após crash.
- Exatamente uma vez para ferramentas com efeitos reais.
- Proteção de autorização, sandbox ou segurança em cenários adversariais.
- Steering, followUp e abort em execução ativa, concorrência e compactação.
- Desempenho, custo operacional ou superioridade sobre OpenHands, Codex, OpenCode, Deep Agents, Mistral Vibe e Mastra.

## Decisão operacional para o próximo bloco

**REUSE_EMBED_BASIC_FUNCTIONAL = PASS (escopo estreito; evidência do operador).**

Não copiar o código-fonte upstream para a árvore do projeto; manter dependência por versão travada. Expandir o experimento por **um bloco substantivo** cobrindo uma ferramenta de arquivo em diretório temporário controlado, steering, follow-up, cancelamento, eventos e limites de argumentos, tudo com provedor determinístico; nenhum comando irreversível, nem chamadas pagas. Separar resultados de testes de confiabilidade e segurança não executados.

A auditoria concorrente de alternativas continua: êxito de um candidato não o torna vencedor.

Não alterar `main`, não efetuar merge, não abrir PR adicional.
