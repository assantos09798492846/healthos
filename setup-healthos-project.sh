#!/usr/bin/env bash
set -euo pipefail
ROOT="${1:-$HOME/Documents/healthos}"
PROJECT_DIR="$ROOT/.project"
mkdir -p "$PROJECT_DIR"
cat > "$PROJECT_DIR/PROJECT_STATUS.md" <<'EOT'
# HealthOS — Project Status
Última atualização: 2026-08-10
Versão de trabalho: v0.2.0-alpha.1
Status: Em desenvolvimento

## Concluído
- [x] Backend NestJS operacional
- [x] PostgreSQL + Prisma operacional
- [x] Cadastro e consulta de pacientes
- [x] Upload de documentos PDF
- [x] Storage local de documentos
- [x] SHA-256 e bloqueio de duplicidade
- [x] Consulta/download de documentos
- [x] DocumentProcessingJob
- [x] Endpoint para criar job
- [x] Endpoint para consultar job
- [x] Endpoint para executar job
- [x] PdfNativeExtractor com pdf-parse v2
- [x] Persistência de extractedText
- [x] Processamento real concluído com status COMPLETED
- [x] PDF de teste: 13 páginas processadas por NATIVE_TEXT

## Em aberto
- [ ] Clinical Parser
- [ ] Persistência automática em LabResult
- [ ] Validação dos resultados extraídos
- [ ] OCR fallback para PDFs sem camada de texto
- [ ] IA clínica
- [ ] Timeline
- [ ] Dashboard
- [ ] Web UI
- [ ] Mobile

## Regra de trabalho
Sempre fornecer o conteúdo completo de qualquer arquivo que precise ser alterado.
EOT
cat > "$PROJECT_DIR/NEXT_TASK.md" <<'EOT'
# Próxima tarefa
## Clinical Parser — Fase 1
Construir o parser clínico que recebe `DocumentProcessingJob.extractedText` e transforma o texto bruto do laudo laboratorial em resultados estruturados.

### Objetivo mínimo da próxima entrega
1. Ler o `extractedText` do job concluído.
2. Detectar exames laboratoriais.
3. Extrair, quando disponíveis: testName, testCode, category, valueNumber, valueText, unit, referenceLow, referenceHigh, referenceText, collectedAt, reportedAt, interpretation.
4. Persistir os resultados em `LabResult`.
5. Preservar vínculo com `patientId` e `sourceDocumentId`.
6. Evitar duplicidade.
7. Criar endpoints Swagger para parse e consulta dos resultados.
8. Criar testes antes de avançar para IA.

### Importante
Não iniciar interpretação clínica por IA antes que a extração estruturada e a validação estejam estáveis.
EOT
cat > "$PROJECT_DIR/CURRENT_CONTEXT.md" <<'EOT'
# Current Context
## Último fluxo validado
Paciente → Documento PDF → DocumentProcessingJob → PdfNativeExtractor → extractedText → COMPLETED

## Identificadores usados nos testes
Document ID: 05347a65-aec8-48de-a718-1f737793682c
Processing Job ID: ceb84aa7-8d0b-4124-86dc-b193a1cb32d3

## Último resultado observado
- status: COMPLETED
- method: NATIVE_TEXT
- progress: 100
- pagesTotal: 13
- pagesProcessed: 13
- extractedText: preenchido

## Stack relevante
- NestJS
- TypeScript
- Prisma
- PostgreSQL
- Swagger
- pdf-parse v2
- storage local em `services/api/storage/documents`

## Regra do usuário
Para qualquer alteração em arquivo, fornecer o arquivo completo pronto para copiar e colar.
EOT
cat > "$PROJECT_DIR/ROADMAP.md" <<'EOT'
# Roadmap HealthOS
## Fase 1 — Foundation
- [x] API
- [x] Banco
- [x] Pacientes
- [x] Prontuário básico
## Fase 2 — Document Intelligence
- [x] Upload PDF
- [x] Storage
- [x] Hash/Deduplicação
- [x] Processing Job
- [x] Extração nativa
- [ ] OCR fallback
- [ ] Clinical Parser
- [ ] Validação
## Fase 3 — Clinical Intelligence
- [ ] Normalização de exames
- [ ] Histórico e tendências
- [ ] Regras clínicas
- [ ] IA com rastreabilidade
## Fase 4 — Experience
- [ ] Timeline clínica
- [ ] Dashboard
- [ ] Relatórios
- [ ] Web
- [ ] Mobile
## Fase 5 — Production
- [ ] Segurança/LGPD
- [ ] Observabilidade
- [ ] Backup/DR
- [ ] CI/CD
- [ ] Pentest
- [ ] Go-live
EOT
cat > "$PROJECT_DIR/CHANGELOG.md" <<'EOT'
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
EOT
cat > "$PROJECT_DIR/DECISIONS.md" <<'EOT'
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
EOT
cat > "$PROJECT_DIR/BACKLOG.md" <<'EOT'
# Backlog
- OCR fallback
- Clinical Parser
- Catálogo canônico de exames
- Normalização de unidades
- Detecção de referências por sexo/idade
- Deduplicação de LabResult
- Revisão manual de baixa confiança
- IA clínica com evidências
- Timeline
- Gráficos de tendência
- Relatórios médicos
- Exportação PDF
- FHIR/HL7
- DICOM
- Web
- Mobile
- LGPD
- Auditoria
EOT
cat > "$PROJECT_DIR/TODO.md" <<'EOT'
# TODO imediato
1. [ ] Fazer checkpoint Git da extração nativa.
2. [ ] Inspecionar modelo `LabResult`.
3. [ ] Definir contrato do Clinical Parser.
4. [ ] Implementar parser determinístico inicial.
5. [ ] Criar testes com o texto já extraído.
6. [ ] Persistir resultados.
7. [ ] Atualizar Swagger.
8. [ ] Atualizar documentação e versionamento.
EOT
cat > "$PROJECT_DIR/SESSION_LOG.md" <<'EOT'
# Session Log
## 2026-08-10
- Corrigido uso do `pdf-parse` para API v2 (`PDFParse` + `getText()`).
- `typecheck` e `build` concluídos sem erro.
- Adicionado endpoint `POST /api/v1/document-processing/{jobId}/run`.
- Executado processamento real.
- PDF identificado por `05347a65-aec8-48de-a718-1f737793682c`.
- Job `ceb84aa7-8d0b-4124-86dc-b193a1cb32d3`.
- Resultado: COMPLETED, NATIVE_TEXT, 13/13 páginas, extractedText persistido.
- Próxima etapa definida: Clinical Parser.
EOT
cat > "$PROJECT_DIR/PROMPT_CONTINUE.md" <<'EOT'
# Prompt para retomar o HealthOS
Continuar o desenvolvimento do projeto HealthOS exatamente do ponto onde paramos.
Leia nesta ordem:
1. `.project/PROJECT_STATUS.md`
2. `.project/CURRENT_CONTEXT.md`
3. `.project/NEXT_TASK.md`
4. `.project/ROADMAP.md`
5. `.project/DECISIONS.md`
6. `.project/CHANGELOG.md`
7. `.project/SESSION_LOG.md`

Regras:
- Não recomeçar o projeto.
- Não sobrescrever decisões existentes sem justificativa.
- Antes de alterar código, confirmar o estado atual com typecheck/build e Git.
- Para qualquer arquivo que precise ser alterado, fornecer SEMPRE o conteúdo completo do arquivo.
- Atualizar `.project` e o versionamento ao fechar cada incremento.
- O próximo incremento é o Clinical Parser.
EOT
printf 'HealthOS .project criado/atualizado em: %s\n' "$PROJECT_DIR"
ls -la "$PROJECT_DIR"
