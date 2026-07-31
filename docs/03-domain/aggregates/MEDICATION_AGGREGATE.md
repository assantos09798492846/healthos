# Agregado MedicationStatement

## Aggregate Root

`MedicationStatement`

## Entidades

- Medication
- Dosage
- Schedule
- AdherenceRecord
- PrescriberReference

## Invariantes

- Início, término e status devem ser consistentes.
- Alteração de dose gera novo período terapêutico.
- Suspensão não apaga histórico.
- Recomendações automáticas não alteram tratamento.
