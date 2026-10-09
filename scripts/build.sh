#!/usr/bin/env bash
set -euo pipefail

# Build all applications from the workspace root.
repository_root="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$repository_root"

pnpm install --frozen-lockfile
pnpm build

printf '%s\n' 'FC Career Top builds are ready.'
