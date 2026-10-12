#!/usr/bin/env bash
# Run after each demo: closes demo PRs (Upsun deletes their environments),
# deletes Dispatch branches, and closes demo issues. main is left untouched.
#   GITHUB_REPO=my-org/dispatch-demo-storefront ./demo/reset.sh
set -euo pipefail
: "${GITHUB_REPO:?Set GITHUB_REPO=owner/name}"

# Pull requests opened by Dispatch (branch upsun-dispatch/...) or by prepare.sh.
gh pr list --repo "$GITHUB_REPO" --state open --limit 100 --json number,headRefName \
  --jq '.[] | select(.headRefName | startswith("upsun-dispatch/") or . == "demo/review-showcase" or . == "demo/golden-stock-status") | "\(.number) \(.headRefName)"' |
while read -r number branch; do
  echo "Closing PR #${number} (${branch})"
  if [[ "$branch" == upsun-dispatch/* ]]; then
    gh pr close "$number" --repo "$GITHUB_REPO" --delete-branch
  else
    gh pr close "$number" --repo "$GITHUB_REPO"   # keep the reusable demo branches
  fi
done

# Dispatch branches without a PR (e.g. a run that stopped before opening one).
gh api "repos/${GITHUB_REPO}/git/matching-refs/heads/upsun-dispatch/" --jq '.[].ref' |
while read -r ref; do
  echo "Deleting ${ref#refs/heads/}"
  gh api -X DELETE "repos/${GITHUB_REPO}/git/${ref}" >/dev/null
done

gh issue list --repo "$GITHUB_REPO" --label demo --state open --json number --jq '.[].number' |
while read -r number; do
  echo "Closing issue #${number}"
  gh issue close "$number" --repo "$GITHUB_REPO" --reason "not planned"
done

echo "Reset done. Run demo/prepare.sh before the next demo."
