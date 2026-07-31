#!/usr/bin/env bash
set -Eeuo pipefail

required=(
  "docs/00-governance/PROJECT_CHARTER.md"
  "docs/00-governance/MANIFESTO.md"
  "docs/01-product/PRODUCT_VISION.md"
  "docs/03-domain/DOMAIN_MODEL.md"
  "docs/04-functional/FUNCTIONAL_SPECIFICATION.md"
  "docs/05-architecture/SOLUTION_ARCHITECTURE.md"
  "docs/10-security/SECURITY_BASELINE.md"
  "docs/11-ai/AI_GOVERNANCE.md"
  "docs/INDEX.md"
)

missing=0

for file in "${required[@]}"; do
  if [[ ! -s "$file" ]]; then
    echo "MISSING: $file"
    missing=1
  else
    echo "OK: $file"
  fi
done

[[ "$missing" -eq 0 ]] || exit 1
echo
echo "HealthOS Foundation validada com sucesso."
