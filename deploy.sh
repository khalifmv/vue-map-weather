#!/usr/bin/env sh
set -e

# build project
npm run build
cd dist
rm -rf .git

# init repo baru
git init
git checkout -b gh-pages
git add -A
git commit -m "deploy"

git push -f https://github.com/khalifmv/vue-map-weather.git gh-pages
cd -