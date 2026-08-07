# Changelog

## [0.1.0] - 2026-07-31

### Added
- Estrutura inicial do repositório.
- Documentação básica do HealthOS.
- Organização por domínios, aplicações, serviços e pacotes.

## [Unreleased]

### Added
- Prisma integration with PostgreSQL
- Initial clinical data model
- Patients REST API
- Medical Records REST API
- Documents module
- PDF upload infrastructure
- SHA-256 document fingerprinting
- Duplicate document detection
- Local clinical document storage
- Swagger/OpenAPI endpoints
- Global DTO validation

### Architecture
- Clinical documents are immutable source artifacts
- Derived clinical data remains traceable to source documents
