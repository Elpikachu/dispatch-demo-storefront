#!/usr/bin/env bash
# Run ~30 minutes before each demo. Creates:
#   1. the Issue to code issue (you trigger it live with "@upsun-dispatch implement")
#   2. a "search" issue + the pre-seeded PR from demo/review-showcase, so Code review has
#      already finished by the time you show it.
#   GITHUB_REPO=my-org/dispatch-demo-storefront ./demo/prepare.sh
set -euo pipefail
: "${GITHUB_REPO:?Set GITHUB_REPO=owner/name}"
cd "$(dirname "$0")/.."

stock_issue="$(gh issue create --repo "$GITHUB_REPO" --label demo \
  --title "Show stock status on products (low stock / sold out)" \
  --body-file demo/issue.md)"
echo "Issue to code issue: ${stock_issue}"

search_issue="$(gh issue create --repo "$GITHUB_REPO" --label demo \
  --title "Add a product search" --body-file demo/search-issue.md)"
search_number="${search_issue##*/}"

showcase_pr="$(gh pr create --repo "$GITHUB_REPO" --base main --head demo/review-showcase \
  --label demo --title "Add catalogue search" \
  --body "Adds a search box and a /search route. Closes #${search_number}.")"
echo "Review showcase PR: ${showcase_pr}"

echo
echo "Next: wait for Code review + CI + the pr-N environment on the showcase PR (~3-5 min),"
echo "then follow DEMO.md. Trigger comment for act 1 (whole comment, nothing else):"
echo "  @upsun-dispatch implement"
