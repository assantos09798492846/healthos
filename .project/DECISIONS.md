# Architecture Decisions
## ADR-001 — PostgreSQL + Prisma
Persistência relacional com Prisma como ORM.
## ADR-002 — Documentos fora do banco
PDFs armazenados em storage local; banco guarda metadados e `storageKey`.
## ADR-003 — SHA-256
Hash usado para detectar importação duplicada por paciente.
## ADR-004 — Pipeline de processamento separado
`DocumentProcessingJob` desacopla upload, extração, OCR, parsing e validação.
## ADR-005 — Extração nativa antes de OCR
PDF com camada de texto usa `pdf-parse`; OCR será fallback.
## ADR-006 — Parser antes da IA
Dados laboratoriais devem ser estruturados e validados antes de interpretação por modelos de IA.
