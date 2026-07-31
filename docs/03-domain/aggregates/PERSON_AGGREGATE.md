# Agregado Person

## Aggregate Root

`Person`

## Entidades

- HealthProfile
- ContactPoint
- EmergencyContact
- Address
- Preference

## Invariantes

- Uma pessoa possui um identificador imutável.
- Alterações relevantes são auditadas.
- Dados sensíveis possuem classificação e finalidade.
- A exclusão deve respeitar retenção legal e rastreabilidade.
