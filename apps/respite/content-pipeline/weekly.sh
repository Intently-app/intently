#!/bin/bash
# Weekly content run for the Respite blog: plan → write (Claude Code headless) → check → test → build → PR.
# launchd runs it on Mondays at 09:00 local (launchd/app.intently.respite.content.plist, install-launchd.sh).
#
#   weekly.sh [--dry-run] [--skip-write] [--week YYYY-WW] [--keep-worktree]
#
#   --dry-run        plan and write as usual, run the checks, but commit, push and open nothing; the result is saved
#                    as a patch in the log directory
#   --skip-write     no Claude step (also CONTENT_SKIP_WRITE=1): proves worktree, npm ci, plan, test and build without
#                    using the owner's Claude usage; never opens a PR
#   --week           plan a given ISO week (default: the current UTC ISO week)
#   --keep-worktree  leave the temporary worktree on disk for inspection
#
# Steps: a fresh detached worktree of origin/main in a temp dir; npm ci; node content-pipeline/plan-week.mjs;
# claude -p with WRITE_PROMPT.md; check-week.mjs; npm test; npm run build; commit on content/<YYYY-WW>; push;
# gh pr create --label content. The PR is never merged here and never gets auto:merge: the owner reviews it.
#
# Claude: the interactive zsh aliases `claude` to `claude-anthropic`, a function in ~/.zshrc that unsets
# ANTHROPIC_AUTH_TOKEN, ANTHROPIC_BASE_URL and API_TIMEOUT_MS and then runs `command claude`. This script does the
# same (and also unsets ANTHROPIC_API_KEY) and runs the real binary: $CLAUDE_BIN, else `command -v claude`, else
# ~/.local/bin/claude (a symlink to ~/.local/share/claude/versions/<version>). So the run uses the owner's Claude
# subscription login, never API billing. Never add --bare: it switches auth to an API key.
#
# Environment (all optional):
#   CONTENT_CHECKOUT        local clone to add worktrees from (default ~/MyLab/WellbeingApps/intently); only fetched
#                           from and worktree-added, its own branch and files are never touched
#   CONTENT_REPO            GitHub repo for the PR (default Intently-app/intently)
#   CONTENT_REF             what to base the worktree on (default origin/main); a local branch is handy to test
#                           pipeline changes before they merge (with --dry-run or --skip-write)
#   OFFSITE_DIR             off-site drafts root (default ~/MyLab/WellbeingApps/Respite/marketing/offsite)
#   CONTENT_LOG_DIR         logs (default ~/Library/Logs/respite-content)
#   CONTENT_CLAUDE_TIMEOUT  seconds before the Claude step is stopped (default 5400)
#   CLAUDE_BIN              path to the claude executable
#   GSC_KEY_FILE            Search Console service-account key (default ~/.config/gsc/service-account.json)
#
# Exit codes: 0 done (PR opened, or a dry/skip-write run passed) · 2 usage, missing tool or a run already going ·
# 3 setup failed (fetch, worktree, npm ci) · 4 planning failed · 5 Claude step failed or timed out ·
# 6 check-week found problems · 7 npm test or build failed · 8 commit, push or PR failed ·
# 9 content/<week> already exists on origin (nothing done).
set -uo pipefail

DRY=0; SKIP_WRITE=${CONTENT_SKIP_WRITE:-0}; WEEK=""; KEEP=0
while [ $# -gt 0 ]; do
  case "$1" in
    --dry-run) DRY=1; shift ;;
    --skip-write) SKIP_WRITE=1; shift ;;
    --week) WEEK=${2:-}; shift 2 ;;
    --keep-worktree) KEEP=1; shift ;;
    -h|--help) sed -n '2,20p' "$0"; exit 0 ;;
    *) echo "usage: weekly.sh [--dry-run] [--skip-write] [--week YYYY-WW] [--keep-worktree]" >&2; exit 2 ;;
  esac
done

CHECKOUT=${CONTENT_CHECKOUT:-$HOME/MyLab/WellbeingApps/intently}
REPO=${CONTENT_REPO:-Intently-app/intently}
REF=${CONTENT_REF:-origin/main}
OFFSITE_ROOT=${OFFSITE_DIR:-$HOME/MyLab/WellbeingApps/Respite/marketing/offsite}
LOG_DIR=${CONTENT_LOG_DIR:-$HOME/Library/Logs/respite-content}
TIMEOUT=${CONTENT_CLAUDE_TIMEOUT:-5400}
[ -n "$WEEK" ] || WEEK=$(date -u +%G-%V)
case "$WEEK" in [0-9][0-9][0-9][0-9]-[0-9][0-9]) ;; *) echo "--week wants YYYY-WW, got $WEEK" >&2; exit 2 ;; esac
RUN_DATE=$(date -u +%Y-%m-%d)
BRANCH="content/$WEEK"
OFFDIR="$OFFSITE_ROOT/$WEEK"

mkdir -p "$LOG_DIR"
LOG="$LOG_DIR/weekly-$WEEK-$(date -u +%Y%m%dT%H%M%SZ).log"
exec > >(tee -a "$LOG") 2>&1

say()  { printf '%s %s\n' "$(date -u +%H:%M:%S)" "$*"; }
step() { printf '\n%s ==> %s\n' "$(date -u +%H:%M:%S)" "$*"; }
need() { command -v "$1" >/dev/null 2>&1 || { say "ERROR '$1' is not on PATH ($PATH)"; exit 2; }; }

WT=""; LOCK="$LOG_DIR/.weekly.lock"; HAVE_LOCK=0
cleanup() {
  if [ -n "$WT" ] && [ -d "$WT" ]; then
    if [ "$KEEP" = 1 ]; then say "worktree kept at $WT (git -C \"$CHECKOUT\" worktree remove --force \"$WT\" when done)"
    else git -C "$CHECKOUT" worktree remove --force "$WT" >/dev/null 2>&1 || rm -rf "$WT"; git -C "$CHECKOUT" worktree prune >/dev/null 2>&1; fi
  fi
  if [ "$KEEP" != 1 ] && git -C "$CHECKOUT" show-ref --verify --quiet "refs/heads/$BRANCH"; then
    git -C "$CHECKOUT" branch -D "$BRANCH" >/dev/null 2>&1 || true
  fi
  [ "$HAVE_LOCK" = 1 ] && rmdir "$LOCK" 2>/dev/null
  return 0
}
trap cleanup EXIT
trap 'say "interrupted"; exit 130' INT TERM

notify() { osascript -e "display notification \"$1\" with title \"Respite content $WEEK\"" >/dev/null 2>&1 || true; }

# Saves whatever the run produced as a patch, so a failed or dry run's writing is not lost with the worktree.
save_patch() {
  [ -n "$WT" ] && [ -d "$WT" ] || return 0
  local out="$LOG_DIR/$WEEK$1.patch"
  git -C "$WT" add -A apps/respite >/dev/null 2>&1 && git -C "$WT" diff --cached --binary > "$out" 2>/dev/null
  git -C "$WT" reset -q >/dev/null 2>&1
  [ -s "$out" ] && say "changes saved to $out (git apply it on a fresh branch)" || rm -f "$out"
}

fail() { # CODE MESSAGE
  say "FAILED ($1): $2"
  save_patch "-failed"
  say "log: $LOG"
  notify "Failed: $2 (exit $1). Log in $LOG_DIR"
  exit "$1"
}

resolve_claude() {
  if [ -n "${CLAUDE_BIN:-}" ]; then printf '%s\n' "$CLAUDE_BIN"; return; fi
  local p; p=$(command -v claude 2>/dev/null || true)
  [ -n "$p" ] || p="$HOME/.local/bin/claude"
  printf '%s\n' "$p"
}

# Runs "$@" and stops it after SECS seconds (macOS has no timeout(1)). Returns the command's status, 124 on timeout.
run_with_timeout() {
  local secs=$1; shift
  "$@" &
  local pid=$! flag; flag=$(mktemp "${TMPDIR:-/tmp}/respite-content-timeout.XXXXXX"); rm -f "$flag"
  ( sleep "$secs"; touch "$flag"; kill -TERM "$pid" 2>/dev/null; sleep 15; kill -KILL "$pid" 2>/dev/null ) &
  local watchdog=$!
  wait "$pid"; local rc=$?
  pkill -P "$watchdog" >/dev/null 2>&1; kill "$watchdog" >/dev/null 2>&1; wait "$watchdog" 2>/dev/null
  if [ -e "$flag" ]; then rm -f "$flag"; return 124; fi
  return "$rc"
}

say "Respite weekly content: week $WEEK, run date $RUN_DATE (UTC)$([ "$DRY" = 1 ] && echo ', DRY RUN')$([ "$SKIP_WRITE" = 1 ] && echo ', no write step')"
say "log: $LOG"
need git; need node; need npm
[ "$DRY" = 1 ] || [ "$SKIP_WRITE" = 1 ] || need gh

if ! mkdir "$LOCK" 2>/dev/null; then say "another weekly run is going (remove $LOCK if it is stale)"; exit 2; fi
HAVE_LOCK=1

# --- 1. Fresh worktree of origin/main ------------------------------------------------------------------------
step "Fresh worktree of $REF"
[ -d "$CHECKOUT/.git" ] || [ -f "$CHECKOUT/.git" ] || fail 3 "no git checkout at $CHECKOUT (set CONTENT_CHECKOUT)"
git -C "$CHECKOUT" fetch -q origin main || fail 3 "git fetch origin main"
if [ "$DRY" = 0 ] && [ "$SKIP_WRITE" = 0 ] && git -C "$CHECKOUT" ls-remote --exit-code --heads origin "$BRANCH" >/dev/null 2>&1; then
  say "$BRANCH already exists on origin: this week is done or in review. Nothing to do."
  exit 9
fi
git -C "$CHECKOUT" show-ref --verify --quiet "refs/heads/$BRANCH" && git -C "$CHECKOUT" branch -D "$BRANCH" >/dev/null
WT=$(mktemp -d "${TMPDIR:-/tmp}/respite-content-$WEEK.XXXXXX") || fail 3 "mktemp"
git -C "$CHECKOUT" worktree add -q --detach "$WT" "$REF" || fail 3 "git worktree add $REF"
say "worktree $WT at $REF ($(git -C "$WT" rev-parse --short HEAD))"
[ "$REF" = origin/main ] || [ "$DRY" = 1 ] || [ "$SKIP_WRITE" = 1 ] || fail 2 "CONTENT_REF=$REF is for --dry-run or --skip-write only (PRs are based on origin/main)"

step "npm ci"
( cd "$WT" && npm ci --no-audit --no-fund --loglevel=error ) || fail 3 "npm ci"
SITE="$WT/apps/respite"
cd "$SITE" || fail 3 "no apps/respite in the worktree"

# --- 2. Plan -------------------------------------------------------------------------------------------------
step "Plan the week (Search Console, read-only)"
OFFSITE_DIR="$OFFSITE_ROOT" node content-pipeline/plan-week.mjs --week "$WEEK" || fail 4 "plan-week.mjs"
BRIEF="content-pipeline/weeks/$WEEK.json"
TITLE=$(node -e 'const b=require(process.argv[1]);process.stdout.write(b.onsite.topic)' "$SITE/$BRIEF")
SLUG=$(node -e 'const b=require(process.argv[1]);process.stdout.write(b.onsite.slug)' "$SITE/$BRIEF")

# --- 3. Write (Claude Code headless, the owner's subscription) ---------------------------------------------------
if [ "$SKIP_WRITE" = 1 ]; then
  step "Write: skipped (--skip-write)"
else
  step "Write with Claude Code (headless)"
  CLAUDE=$(resolve_claude)
  [ -x "$CLAUDE" ] || fail 5 "claude not found (set CLAUDE_BIN; it is usually ~/.local/bin/claude)"
  say "claude: $CLAUDE ($("$CLAUDE" --version 2>/dev/null | head -1)), timeout ${TIMEOUT}s"
  mkdir -p "$OFFDIR" || fail 5 "mkdir $OFFDIR"
  PROMPT="WEEK=$WEEK
RUN_DATE=$RUN_DATE
BRIEF=$BRIEF
OFFSITE_DIR=$OFFDIR

$(cat content-pipeline/WRITE_PROMPT.md)"
  run_with_timeout "$TIMEOUT" env -u ANTHROPIC_API_KEY -u ANTHROPIC_AUTH_TOKEN -u ANTHROPIC_BASE_URL -u API_TIMEOUT_MS \
    "$CLAUDE" -p "$PROMPT" \
      --permission-mode acceptEdits \
      --permission-prompts none \
      --allowedTools "Read,Edit,Write,Glob,Grep,Bash(node scripts/render-heroes.mjs:*),Bash(node content-pipeline/check-week.mjs:*),Bash(npm test),Bash(npm run build),Bash(mkdir -p:*),Bash(ls:*),Bash(wc:*)" \
      --disallowedTools "Bash(git:*),Bash(gh:*),Bash(curl:*),WebFetch,WebSearch" \
      --add-dir "$OFFDIR" \
      --strict-mcp-config \
      --no-session-persistence \
      < /dev/null
  rc=$?
  [ "$rc" = 124 ] && fail 5 "Claude step timed out after ${TIMEOUT}s"
  [ "$rc" = 0 ] || fail 5 "Claude step exited $rc"

  step "Check the writing"
  node content-pipeline/check-week.mjs --week "$WEEK" --offsite-dir "$OFFDIR" || fail 6 "check-week.mjs found problems"
fi

# --- 4. Test and build -------------------------------------------------------------------------------------------
step "npm test"
npm test || fail 7 "npm test"
step "npm run build (with the link check)"
npm run build || fail 7 "npm run build"

# --- 5. Commit, push, PR -----------------------------------------------------------------------------------------
cd "$WT" || fail 8 "cd worktree"
OUTSIDE=$(git status --porcelain | grep -v ' apps/respite/' || true)
[ -n "$OUTSIDE" ] && say "WARN changes outside apps/respite are left out of the commit:
$OUTSIDE"

if [ "$DRY" = 1 ] || [ "$SKIP_WRITE" = 1 ]; then
  step "No commit, push or PR ($([ "$DRY" = 1 ] && echo dry run || echo skip-write run))"
  git status --short apps/respite
  save_patch ""
  say "done: plan $BRIEF, on-site \"$TITLE\" ($SLUG); off-site drafts in $OFFDIR"
  exit 0
fi

step "Commit on $BRANCH"
git switch -q -c "$BRANCH" || fail 8 "git switch -c $BRANCH"
git add -A apps/respite || fail 8 "git add"
git diff --cached --quiet && fail 8 "nothing to commit"
git commit -q -F - <<EOF || fail 8 "git commit"
content: $TITLE ($WEEK)

Weekly content pipeline (apps/respite/content-pipeline): on-site post /blog/$SLUG/, its hero, the week's
brief and the published.yml / backlog.yml updates. The off-site draft is outside the repo: $OFFDIR

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
git push -q -u origin "$BRANCH" || fail 8 "git push"

step "Pull request"
gh label create content --repo "$REPO" --color 1D76DB --description "Weekly content pipeline (apps/respite/content-pipeline)" --force >/dev/null 2>&1 \
  || say "WARN could not create or update the content label"
BODY=$(mktemp "${TMPDIR:-/tmp}/respite-content-pr.XXXXXX")
{
  node -e 'const b=require(process.argv[1]);process.stdout.write(b.summary_md)' "$SITE/$BRIEF"
  cat <<EOF


### Review

- [ ] Read the post: \`apps/respite/src/content/blog/$SLUG.md\` (facts only from content-guide.md and competitor-facts.md, no invented numbers)
- [ ] Look at the hero: \`apps/respite/public/images/blog/$SLUG.jpg\`
- [ ] Off-site draft (not in this PR): \`$OFFDIR/\` (article.md, targets.md, pitch-email.md)

### After merge (merge deploys the site)

1. \`cd apps/respite && node scripts/indexnow.mjs --sitemap\`, then commit \`scripts/.indexnow-seen.json\`
2. Search Console › URL inspection › \`https://respite.liveintently.app/blog/$SLUG/\` › Request indexing
3. Publish the off-site article yourself, then set its \`url\` in \`content-pipeline/published.yml\`

Made by \`content-pipeline/weekly.sh\` on the Mac (log: \`$LOG\`). Never auto-merged.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
} > "$BODY"
PR_URL=$(gh pr create --repo "$REPO" --base main --head "$BRANCH" --title "Content $WEEK: $TITLE" --label content --body-file "$BODY") \
  || { rm -f "$BODY"; fail 8 "gh pr create (the branch is pushed: open the PR by hand)"; }
rm -f "$BODY"
say "PR: $PR_URL"
notify "PR ready for review: $TITLE"
exit 0
