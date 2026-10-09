#!/usr/bin/env bash
set -euo pipefail

# Prepare the consolidated checkout. Deploy and restart specific services only
# after their working directories and environment configuration are migrated.
repository_root="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/../../.." && pwd)"
cd "$repository_root"

pnpm install --frozen-lockfile
pnpm build

printf '%s\n' 'FC Career Top builds are ready. No services were restarted.'
