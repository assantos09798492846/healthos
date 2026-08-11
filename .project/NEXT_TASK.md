# Próxima tarefa
## Clinical Parser — Fase 1
Construir o parser clínico que recebe `DocumentProcessingJob.extractedText` e transforma o texto bruto do laudo laboratorial em resultados estruturados.

### Objetivo mínimo da próxima entrega
1. Ler o `extractedText` do job concluído.
2. Detectar exames laboratoriais.
3. Extrair, quando disponíveis: testName, testCode, category, valueNumber, valueText, unit, referenceLow, referenceHigh, referenceText, collectedAt, reportedAt, interpretation.
4. Persistir os resultados em `LabResult`.
5. Preservar vínculo com `patientId` e `sourceDocumentId`.
6. Evitar duplicidade.
7. Criar endpoints Swagger para parse e consulta dos resultados.
8. Criar testes antes de avançar para IA.

### Importante
Não iniciar interpretação clínica por IA antes que a extração estruturada e a validação estejam estáveis.
