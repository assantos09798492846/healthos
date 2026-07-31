# Padrão de Paginação

## Parâmetros

- `page`
- `pageSize`
- `sort`
- `direction`

## Resposta

```json
{
  "items": [],
  "page": 1,
  "pageSize": 20,
  "totalItems": 0,
  "totalPages": 0
}
```

## Limites

- `pageSize` padrão: 20.
- `pageSize` máximo: 100.
