# HealthOS — Status do Projeto

## Estado atual

Backend principal baseado em NestJS, PostgreSQL e Prisma.

### Infraestrutura concluída

- PostgreSQL via Docker
- pgAdmin
- Prisma ORM
- Prisma migrations
- NestJS
- Swagger / OpenAPI
- Validação global com class-validator
- Configuração de ambiente via .env
- Health check da API

### Módulos implementados

#### Patients
- GET /api/v1/patients
- POST /api/v1/patients
- GET /api/v1/patients/{id}
- PATCH /api/v1/patients/{id}
- DELETE /api/v1/patients/{id}

Status: funcional e validado.

#### Medical Records
- GET /api/v1/patients/{patientId}/medical-record
- POST /api/v1/patients/{patientId}/medical-record
- PATCH /api/v1/patients/{patientId}/medical-record
- DELETE /api/v1/patients/{patientId}/medical-record

Status: implementado e compilando.

#### Documents
Estrutura inicial implementada para:
- upload de PDFs
- SHA-256
- armazenamento local
- metadados no PostgreSQL
- listagem de documentos
- consulta de documento
- recuperação do arquivo original
- prevenção de duplicidade por hash

Status:
- typecheck: OK
- build: OK
- upload real ainda será validado

## Modelos Prisma existentes

- User
- Patient
- MedicalRecord
- Document
- LabResult
- Medication
- AuditLog

## Próximas etapas

1. Validar endpoints Documents no Swagger
2. Realizar primeiro upload controlado
3. Validar arquivo físico e registro PostgreSQL
4. Validar SHA-256 e detecção de duplicidade
5. Implementar extração textual de PDF
6. Criar pipeline de processamento clínico
7. Popular LabResult automaticamente
8. Implementar normalização de exames
9. Implementar histórico longitudinal
10. Implementar timeline clínica
11. Implementar insights clínicos
12. Dashboard
13. Relatórios
14. Frontend web/PWA

## Regra de integridade documental

O documento clínico original é imutável.

Dados extraídos, interpretações, OCR, IA e resultados estruturados são derivados e devem manter rastreabilidade até o arquivo original.

