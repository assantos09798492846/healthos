# Mapa de Contextos

```mermaid
flowchart LR
    Identity --> HealthProfile
    HealthProfile --> ClinicalRecord
    ClinicalRecord --> Diagnostics
    ClinicalRecord --> Medication
    Documents --> Diagnostics
    Diagnostics --> Timeline
    Medication --> Timeline
    Devices --> Timeline
    Timeline --> Analytics
    Analytics --> Reporting
    Diagnostics --> AI
    Timeline --> AI
    AI --> Reporting
    Consent --> Integrations
    Integrations --> Devices
    Audit -. observes .-> Identity
    Audit -. observes .-> ClinicalRecord
    Audit -. observes .-> Documents
```
