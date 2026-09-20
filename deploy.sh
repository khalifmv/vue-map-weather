#!/usr/bin/env sh
# Manual deploy, an escape hatch for when CI is unavailable.
#
# Normally you do not need this: .github/workflows/deploy.yml publishes to
# gh-pages on every push to main, and the Actions tab can redeploy on demand.
set -eu

REMOTE=$(git remote get-url origin)
SOURCE_COMMIT=$(git rev-parse --short HEAD)
WORKTREE=.gh-pages-out

if [ -n "$(git status --porcelain)" ]; then
  echo "Working tree is dirty. Commit or stash first, so the deployed build" >&2
  echo "matches a real commit." >&2
  exit 1
fi

npm ci
npm run build

# GitHub Pages runs Jekyll on branch deploys, which drops paths starting with
# an underscore. This opts out.
touch dist/.nojekyll

# A worktree keeps the branch history instead of recreating it every deploy,
# and avoids running rm near the project's own .git directory.
git worktree remove --force "$WORKTREE" 2>/dev/null || true
if git ls-remote --exit-code --heads origin gh-pages >/dev/null 2>&1; then
  git fetch --depth=1 origin gh-pages
  git worktree add "$WORKTREE" origin/gh-pages
  git -C "$WORKTREE" checkout -B gh-pages
else
  git worktree add --orphan -b gh-pages "$WORKTREE"
fi

find "$WORKTREE" -mindepth 1 -maxdepth 1 ! -name .git -exec rm -rf {} +
cp -R dist/. "$WORKTREE"/

cd "$WORKTREE"
git add -A
if git diff --staged --quiet; then
  echo "Build output is unchanged, nothing to publish."
else
  git commit -m "deploy: $SOURCE_COMMIT"
  git push "$REMOTE" gh-pages
  echo "Published $SOURCE_COMMIT to gh-pages."
fi
cd - >/dev/null
git worktree remove --force "$WORKTREE"
