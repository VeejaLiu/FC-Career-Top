#!/usr/bin/env bash
set -e

project_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$project_dir"

# VSCode may inherit a different Node version from the desktop environment.
nvm_script="${NVM_DIR:-$HOME/.nvm}/nvm.sh"
if [ -s "$nvm_script" ]; then
  source "$nvm_script"
  nvm use --silent
fi

# Corepack reads the pinned pnpm version from package.json.
if command -v corepack >/dev/null 2>&1; then
  # Workspace scripts invoke pnpm again, so they also need Corepack's shim.
  corepack enable pnpm
  exec corepack pnpm "$@"
fi

exec pnpm "$@"
