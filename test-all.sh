#!/usr/bin/env bash
set -euo pipefail

root_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "== Frame =="
pnpm --dir "$root_dir/frame" test:run

echo "== Paper =="
(cd "$root_dir/paper" && go list -f '{{if or .TestGoFiles .XTestGoFiles}}{{.ImportPath}}{{end}}' ./... | grep -v '^$' | xargs -r go test)

echo "== Studio =="
(cd "$root_dir/studio" && go list -f '{{if or .TestGoFiles .XTestGoFiles}}{{.ImportPath}}{{end}}' ./... | grep -v '^$' | xargs -r go test)

echo "All tests passed."