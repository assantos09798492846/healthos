# Padrão de Idempotência

## Aplicação

Operações de importação, upload, sincronização e geração de relatórios devem aceitar:

```text
Idempotency-Key: <uuid>
```

## Regras

- A mesma chave com o mesmo conteúdo retorna o mesmo resultado.
- A mesma chave com conteúdo diferente retorna conflito.
- A chave deve possuir retenção configurável.
- Eventos de auditoria registram a chave utilizada.
