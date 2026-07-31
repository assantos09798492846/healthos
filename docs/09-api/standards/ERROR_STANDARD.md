# Padrão de Erros

## Estrutura

```json
{
  "type": "https://healthos.local/problems/validation-error",
  "title": "Validation error",
  "status": 422,
  "detail": "One or more fields are invalid.",
  "instance": "/api/v1/people",
  "correlationId": "uuid",
  "errors": [
    {
      "field": "birthDate",
      "code": "invalid_date",
      "message": "birthDate must be a valid ISO 8601 date."
    }
  ]
}
```

## Códigos principais

- 400 — Requisição inválida.
- 401 — Não autenticado.
- 403 — Não autorizado.
- 404 — Recurso não encontrado.
- 409 — Conflito ou duplicidade.
- 422 — Validação de domínio.
- 429 — Limite excedido.
- 500 — Erro interno.
