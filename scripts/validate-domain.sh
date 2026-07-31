#!/usr/bin/env bash
set -Eeuo pipefail

required=(
  docs/03-domain/DOMAIN_OVERVIEW.md
  docs/03-domain/BOUNDED_CONTEXTS.md
  docs/03-domain/aggregates/PERSON_AGGREGATE.md
  docs/03-domain/aggregates/DIAGNOSTIC_REPORT_AGGREGATE.md
  docs/03-domain/events/DOMAIN_EVENT_CATALOG.md
  docs/03-domain/rules/BUSINESS_RULES.md
  docs/03-domain/glossary/CLINICAL_GLOSSARY.md
  docs/03-domain/diagrams/DOMAIN_CONTEXT_MAP.md
  docs/03-domain/TRACEABILITY_MATRIX.md
)

failed=0

for file in "${required[@]}"; do
  if [[ -s "$file" ]]; then
    echo "OK: $file"
  else
    echo "MISSING: $file"
    failed=1
  fi
done

[[ "$failed" -eq 0 ]] || exit 1

echo
echo "HealthOS Domain Baseline validado com sucesso."
