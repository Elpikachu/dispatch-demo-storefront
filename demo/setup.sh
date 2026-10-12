#!/usr/bin/env bash
# One-time setup: GitHub repo + Upsun Cloud project + GitHub integration.
# Run from the repository root on your machine:
#   GITHUB_REPO=my-org/dispatch-demo-storefront UPSUN_ORG=my-upsun-org ./demo/setup.sh
#
# Prerequisites: git, gh (logged in), upsun CLI (logged in).
# Optional: UPSUN_REGION (default eu-5.platform.sh), UPSUN_PROJECT (reuse an existing project),
#           GITHUB_TOKEN (default: `gh auth token`; needs the repo and admin:repo_hook scopes).
set -euo pipefail

: "${GITHUB_REPO:?Set GITHUB_REPO=owner/name}"
: "${UPSUN_ORG:?Set UPSUN_ORG to your Upsun organization name}"
UPSUN_REGION="${UPSUN_REGION:-eu-5.platform.sh}"

for cmd in git gh upsun; do
  command -v "$cmd" >/dev/null || { echo "Missing command: $cmd" >&2; exit 1; }
done

step() { printf '\n\033[1;32m==> %s\033[0m\n' "$*"; }

step "1/4 Local Git repository"
if [ ! -d .git ]; then
  git init -q -b main
  git add -A
  git commit -qm "Initial storefront"
fi

step "2/4 GitHub repository ${GITHUB_REPO}"
if gh repo view "$GITHUB_REPO" >/dev/null 2>&1; then
  echo "Repository exists, pushing."
  git remote get-url origin >/dev/null 2>&1 || git remote add origin "https://github.com/${GITHUB_REPO}.git"
  git push -u origin main
else
  gh repo create "$GITHUB_REPO" --private --source . --remote origin --push
fi
# Demo branches (they exist only if you received the repo with them).
for branch in demo/golden-stock-status demo/review-showcase; do
  if git show-ref --verify --quiet "refs/heads/${branch}"; then
    git push -u origin "$branch"
  fi
done
gh label create demo --color FFD84D --description "Created by the Dispatch demo scripts" --repo "$GITHUB_REPO" --force

step "3/4 Upsun Cloud project"
if [ -z "${UPSUN_PROJECT:-}" ]; then
  output="$(upsun project:create --title "Dispatch demo storefront" --org "$UPSUN_ORG" \
    --region "$UPSUN_REGION" --default-branch main --no-set-remote --yes 2>&1 | tee /dev/stderr)"
  UPSUN_PROJECT="$(printf '%s' "$output" | grep -Eo 'Project ID: *[a-z0-9]+' | awk '{print $NF}' | tail -1)"
  if [ -z "$UPSUN_PROJECT" ]; then
    read -r -p "Could not read the project ID. Paste it here: " UPSUN_PROJECT
  fi
fi
echo "Upsun project: ${UPSUN_PROJECT}"

step "4/4 GitHub integration (PR environments)"
if [ -z "${GITHUB_TOKEN:-}" ]; then
  # Upsun needs admin:repo_hook to create the webhook. This is a no-op if you already have it.
  gh auth refresh -h github.com -s admin:repo_hook,read:org
  GITHUB_TOKEN="$(gh auth token)"
fi
upsun integration:add --project "$UPSUN_PROJECT" --type github \
  --repository "$GITHUB_REPO" --token "$GITHUB_TOKEN" \
  --build-pull-requests true --build-draft-pull-requests true \
  --build-pull-requests-post-merge false --pull-requests-clone-parent-data true \
  --fetch-branches true --prune-branches true --yes

echo
echo "Done. Upsun is now building 'main' from GitHub."
echo "  Console: upsun project:info --project ${UPSUN_PROJECT}"
echo "  URL:     upsun url --project ${UPSUN_PROJECT} --environment main --primary --pipe"
echo
echo "Remaining manual steps in the Dispatch console (see DEMO.md, 'One-time setup'):"
echo "  - Install the Upsun Dispatch GitHub App on ${GITHUB_REPO}"
echo "  - Enable Issue to code and Code review (automatic trigger) for the repository"
