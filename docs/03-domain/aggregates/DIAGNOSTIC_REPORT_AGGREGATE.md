# Agregado DiagnosticReport

## Aggregate Root

`DiagnosticReport`

## Entidades

- Observation
- ObservationVersion
- ReferenceRange
- Specimen
- DiagnosticPanel
- Interpretation

## Value Objects

- Quantity
- Unit
- Method
- ResultStatus
- ClinicalClassification
- Provenance

## Invariantes

- Toda observação deve ter origem.
- Valor original e valor normalizado são preservados.
- Correções criam nova versão.
- Inferências de IA não alteram observações confirmadas.
- Resultado sem referência deve ser explicitamente marcado.
