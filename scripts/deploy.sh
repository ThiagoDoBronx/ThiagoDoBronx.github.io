#!/usr/bin/env bash
# Build and publish dist/ to the gh-pages branch (GitHub Pages).
set -euo pipefail
cd "$(dirname "$0")/.."
npm run build
touch dist/.nojekyll
SRC=$(git rev-parse --short HEAD)
cd dist
rm -rf .git
git init -q -b gh-pages
git add -A
git commit -q -m "Deploy ${SRC}"
git push -f "$(git -C .. remote get-url origin)" gh-pages
rm -rf .git
