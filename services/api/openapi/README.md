# OpenAPI

O arquivo `openapi.yaml` é o contrato inicial da API HealthOS.

## Regras

- Alterações incompatíveis exigem nova versão.
- Endpoints implementados devem permanecer consistentes com o contrato.
- Erros usam `application/problem+json`.
- Operações de importação devem usar idempotência.
