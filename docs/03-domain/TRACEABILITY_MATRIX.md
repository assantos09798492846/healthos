# Matriz de Rastreabilidade Inicial

| Requisito | Contexto | Agregado | Evento | Documento |
|---|---|---|---|---|
| RF-002 | Documents | Document | DocumentUploaded | DOCUMENT_AGGREGATE |
| RF-003 | Diagnostics | DiagnosticReport | ObservationImported | DIAGNOSTIC_REPORT_AGGREGATE |
| RF-004 | Diagnostics | Observation | ObservationReviewed | DIAGNOSTIC_REPORT_AGGREGATE |
| RF-005 | Timeline | HealthTimeline | TimelineEventCreated | TIMELINE_AGGREGATE |
| RF-006 | Medication | MedicationStatement | MedicationStarted | MEDICATION_AGGREGATE |
| RF-009 | Audit | AuditEvent | ClinicalDataChanged | DOMAIN_EVENT_CATALOG |
| RF-010 | Devices | Device | DeviceConnected | DEVICE_AGGREGATE |
| RF-011 | AI Assistance | AIInsight | AIInsightGenerated | AI_INSIGHT_AGGREGATE |
| RF-012 | Documents | Document | DuplicateDocumentDetected | DOCUMENT_AGGREGATE |
