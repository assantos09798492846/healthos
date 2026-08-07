# ADR-001 — Integridade e rastreabilidade de documentos clínicos

## Status

Aceito.

## Contexto

O HealthOS importa documentos clínicos que posteriormente poderão ser processados por OCR, parsers e modelos de inteligência artificial.

É necessário garantir rastreabilidade entre os dados interpretados e o documento clínico original.

## Decisão

O arquivo original será tratado como fonte documental imutável.

Cada documento terá:

- paciente proprietário
- nome original
- MIME type
- tamanho
- storage key
- SHA-256
- tipo clínico
- data do documento
- data de importação

O SHA-256 será utilizado para identificação de conteúdo e detecção de duplicidade.

Dados derivados não substituirão o arquivo original.

## Dados derivados

Podem incluir:

- texto extraído
- OCR
- resultados laboratoriais
- normalização
- classificação
- interpretação
- insights de IA
- indicadores
- relatórios

Todos deverão preservar vínculo com a fonte original quando aplicável.

## Consequências

Benefícios:

- auditabilidade
- rastreabilidade
- prevenção de duplicidade
- capacidade de reprocessamento
- preservação da evidência original

Custo:

- necessidade de armazenamento permanente dos documentos originais
- necessidade de gestão de retenção, backup e segurança

