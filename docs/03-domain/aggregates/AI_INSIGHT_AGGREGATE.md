# Agregado AIInsight

## Aggregate Root

`AIInsight`

## Entidades

- EvidenceReference
- ModelExecution
- ConfidenceAssessment
- HumanReview
- RecommendationForDiscussion

## Invariantes

- Insight não é fato clínico.
- Modelo, versão e prompt técnico devem ser rastreáveis.
- Evidências e limitações são obrigatórias.
- Conteúdo de alto risco requer revisão humana.
- O usuário pode rejeitar ou arquivar um insight.
