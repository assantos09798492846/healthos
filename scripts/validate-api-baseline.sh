#!/usr/bin/env bash
set -Eeuo pipefail

required=(
  docs/09-api/API_BASELINE.md
  docs/09-api/standards/ERROR_STANDARD.md
  docs/09-api/standards/PAGINATION_STANDARD.md
  docs/09-api/standards/IDEMPOTENCY_STANDARD.md
  docs/09-api/contracts/RESOURCE_CONTRACTS.md
  services/api/openapi/openapi.yaml
  services/api/openapi/README.md
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

if ! grep -q '^openapi: 3.1.0' services/api/openapi/openapi.yaml; then
  echo "INVALID: OpenAPI version"
  failed=1
fi

if ! grep -q '/people/{personId}/observations:' services/api/openapi/openapi.yaml; then
  echo "MISSING PATH: observations"
  failed=1
fi

[[ "$failed" -eq 0 ]] || exit 1

echo
echo "HealthOS API Baseline validado com sucesso."
