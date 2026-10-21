# CORE-OPT-001 — Implementação orientada por gargalos

**Estado:** backlog técnico priorizado, não otimização comprovada. Meta: melhorar core existente, nunca trocar motor por conveniência.

## Primeiro incremento executável

Instrumentar chamadas ao modelo pelo lado do adaptador, sem modificar o loop upstream:
- `context_tokens`, `fresh_input_tokens`, `cache_read_tokens`, `output_tokens`, `tool_schema_bytes`, `observation_bytes`, `duration_ms` e identificador da tarefa;
- quando a API do provedor não fornecer o campo, usar `null`, não zero ou estimativas mascaradas;
- associar chamadas e resultados às ferramentas sem gravar prompts sensíveis;
- exportar JSONL com versão do motor, modelo, preço, ferramenta, perfil de contexto e limites.

### Experimentos de ablação a pré-registrar

| Experimento | Controle | Variante | Hipótese falsificável |
|---|---|---|---|
| E1 | Tool schemas íntegros | Descoberta/ativação sob demanda pela API pública | Menor entrada fresca e custo por tarefa correta |
| E2 | Observações integrais dentro do limite da API | Limites seletivos por tipo e recuperação explícita | Menos tokens sem perda de informação necessária |
| E3 | Contexto original | Compactação seletiva documentada pelo motor | Maior qualidade sob pressão de contexto sem piora significativa fora dela |

Não implementar E1–E3 simultaneamente: medir cada intervenção isoladamente na mesma tarefa, modelo e ambiente. Se o motor já oferecer a função, preferir configuração existente.

## Condições de adoção

1. Registrar baseline reproduzível com oráculo externo e falhas incluídas.
2. Executar repetição suficiente para estimar variabilidade, definida antes de medir.
3. Não adotar mudança que reduza correção, permissões ou confiabilidade além dos limites justificados e pré-registrados.
4. Comparar custo por tarefa correta, e não apenas tokens por chamada.
5. Integrar mudança pequena e reversível; preservar upstream. Se melhoria não se sustentar, reverter.

## Próximo trabalho de código

Criar um adaptador de instrumentação do modelo com métricas de uso do próprio provedor, sem duplicar o ciclo. Incluir testes de encaminhamento sem alteração de comportamento e de ausência de telemetria. Conectar ao donor efetivamente adotado **após verificar seu contrato público**.

**Importante:** nenhum ganho foi demonstrado nesta etapa. Não transformar hipótese em PASS nem número fictício.
