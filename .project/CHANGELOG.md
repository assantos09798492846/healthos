# Changelog
## 2026-08-10 — Document Processing / Native PDF Extraction
### Added
- DocumentProcessingJob no Prisma.
- Módulo `document-processing`.
- Criação, consulta e execução de jobs.
- `PdfNativeExtractor`.
- Extração com `pdf-parse` v2.
- Persistência de `extractedText`.
- Contagem de páginas e progresso.
### Validated
- PDF clínico de 13 páginas processado integralmente.
- Status final `COMPLETED`.
- Método `NATIVE_TEXT`.
- Progresso `100`.
### Next
- Clinical Parser estruturando resultados em `LabResult`.
