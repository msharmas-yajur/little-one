#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────
#  Regenerate a page for every child listed in _data/children.yml
#  Run this after adding a new child block to the registry.
#  Usage:  bash new-child.sh
# ─────────────────────────────────────────────────────────────
set -euo pipefail
cd "$(dirname "$0")"

# crude YAML id extractor: lines like "- id: some-id"
grep -E '^\s*-\s*id:' _data/children.yml | sed -E 's/^\s*-\s*id:\s*"?([^"]+)"?.*/\1/' | while read -r id; do
  [ -z "$id" ] && continue
  file="_children/${id}.html"
  if [ -f "$file" ]; then
    echo "exists  : $file"
  else
    cat > "$file" <<EOF
---
layout: child
child_id: ${id}
name: ${id}
---
EOF
    echo "created : $file"
  fi
done
echo "Done. Commit and push to publish."
