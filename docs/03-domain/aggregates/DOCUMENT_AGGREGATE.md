# Agregado Document

## Aggregate Root

`Document`

## Entidades

- DocumentVersion
- Attachment
- ExtractionJob
- ExtractionResult
- DicomStudy
- DicomSeries
- DicomInstance

## Invariantes

- O arquivo original é imutável.
- Hash criptográfico identifica duplicidades.
- O tipo declarado não substitui validação real do conteúdo.
- Extração automática exige confiança e revisão conforme risco.
