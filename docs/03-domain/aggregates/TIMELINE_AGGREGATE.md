# Agregado Timeline

## Aggregate Root

`HealthTimeline`

## Entidades

- TimelineEvent
- EventRelation
- Milestone
- Annotation

## Relações

- precedes
- follows
- associated_with
- caused_by
- possibly_related_to
- confirmed_by
- contradicted_by

## Invariantes

- Relações causais exigem nível de evidência.
- Relações inferidas são distintas das confirmadas.
- O usuário pode ocultar visualmente um evento sem apagar o fato.
