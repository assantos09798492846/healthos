# HealthOS — API Baseline

## Objetivo

Definir o contrato inicial da API do HealthOS com foco em:

- consistência;
- rastreabilidade;
- segurança;
- idempotência;
- interoperabilidade;
- evolução sem quebra.

## Princípios

1. Recursos organizados por domínio.
2. OpenAPI como contrato normativo.
3. Versionamento explícito em `/api/v1`.
4. Erros estruturados.
5. `X-Correlation-Id` em todas as requisições.
6. Idempotência em operações sensíveis.
7. Paginação uniforme.
8. Nenhum dado sensível em logs.
9. Auditoria de leitura e alteração de dados clínicos.
10. Fatos clínicos e insights de IA expostos separadamente.
