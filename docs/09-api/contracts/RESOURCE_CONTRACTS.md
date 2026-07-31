# Contratos de Recursos

## People

- `POST /api/v1/people`
- `GET /api/v1/people/{personId}`
- `PATCH /api/v1/people/{personId}`

## Documents

- `POST /api/v1/people/{personId}/documents`
- `GET /api/v1/people/{personId}/documents`
- `GET /api/v1/documents/{documentId}`

## Diagnostic Reports

- `POST /api/v1/people/{personId}/diagnostic-reports`
- `GET /api/v1/people/{personId}/diagnostic-reports`
- `GET /api/v1/diagnostic-reports/{reportId}`

## Observations

- `GET /api/v1/people/{personId}/observations`
- `GET /api/v1/observations/{observationId}`
- `POST /api/v1/observations/{observationId}/versions`

## Medications

- `POST /api/v1/people/{personId}/medication-statements`
- `GET /api/v1/people/{personId}/medication-statements`

## Devices

- `POST /api/v1/people/{personId}/devices`
- `GET /api/v1/people/{personId}/devices`
- `POST /api/v1/devices/{deviceId}/sync-sessions`

## AI Insights

- `GET /api/v1/people/{personId}/ai-insights`
- `GET /api/v1/ai-insights/{insightId}`
- `POST /api/v1/ai-insights/{insightId}/review`
