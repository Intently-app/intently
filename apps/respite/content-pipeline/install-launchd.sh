#!/bin/bash
# Installs the weekly content pipeline as a user LaunchAgent: app.intently.respite.content, Mondays 09:00 local.
#
#   content-pipeline/install-launchd.sh [--dry-run] [--no-load] [--at HH:MM | --utc HH:MM] [--weekday 1-7]
#
#   --dry-run   print the filled plist and the time; copy and load nothing
#   --no-load   copy weekly.sh and the plist into place but do not bootstrap the job
#   --at        local time (default 09:00). launchd schedules in local time, so this follows daylight saving.
#   --utc       a UTC time instead: converted with this Mac's UTC offset right now (date +%z), like the respite-ci
#               jobs; daylight saving moves the offset, so run this again after each change or the job runs an hour off
#   --weekday   launchd weekday, 0 or 7 = Sunday, 1 = Monday (default 1)
#
# weekly.sh is copied to ~/Library/Application Support/respite-content (CONTENT_INSTALL_DIR), so the job does not
# depend on a worktree that may be removed; each run still makes a fresh worktree of origin/main and uses the
# pipeline code (plan-week.mjs, WRITE_PROMPT.md) from there. Run this again after weekly.sh changes on main.
# PATH for the job is the one of the shell that runs this (node, npm, gh, git, claude), so run it from a terminal
# where `node --version` is the nvm version you want. Logs: ~/Library/Logs/respite-content.
# Mirrors ~/Library/Application Support/respite-ci/local-ci/install-launchd.sh.
set -euo pipefail

say() { printf '%s\n' "$*"; }
die() { printf 'ERROR    %s\n' "$*" >&2; exit 2; }

DRY=0; LOAD=1; AT="09:00"; UTC=""; WEEKDAY=1
while [ $# -gt 0 ]; do
  case "$1" in
    --dry-run) DRY=1; shift ;;
    --no-load) LOAD=0; shift ;;
    --at) AT=${2:-}; shift 2 ;;
    --utc) UTC=${2:-}; shift 2 ;;
    --weekday) WEEKDAY=${2:-}; shift 2 ;;
    *) die "usage: install-launchd.sh [--dry-run] [--no-load] [--at HH:MM | --utc HH:MM] [--weekday 1-7]" ;;
  esac
done

HERE=$(cd "$(dirname "$0")" && pwd)
LABEL=app.intently.respite.content
INSTALL_DIR=${CONTENT_INSTALL_DIR:-"$HOME/Library/Application Support/respite-content"}
AGENTS="$HOME/Library/LaunchAgents"
LOG_DIR=${CONTENT_LOG_DIR:-"$HOME/Library/Logs/respite-content"}
CHECKOUT=${CONTENT_CHECKOUT:-"$HOME/MyLab/WellbeingApps/intently"}

hm() { case "$1" in [0-9][0-9]:[0-9][0-9]|[0-9]:[0-9][0-9]) echo "$((10#${1%%:*})) $((10#${1##*:}))" ;; *) die "time wants HH:MM, got $1" ;; esac; }
case "$WEEKDAY" in [0-7]) ;; *) die "--weekday wants 0-7" ;; esac

OFF=$(date +%z)
if [ -n "$UTC" ]; then
  # UTC offset in minutes, e.g. -0500 → -300, +0545 → 345.
  OFFMIN=$(( 10#${OFF:1:2} * 60 + 10#${OFF:3:2} ))
  [ "${OFF:0:1}" = "-" ] && OFFMIN=$(( -OFFMIN ))
  read -r uh um <<<"$(hm "$UTC")"
  t=$(( uh * 60 + um + OFFMIN ))
  # Crossing midnight moves the weekday too.
  if [ "$t" -ge 1440 ]; then t=$(( t - 1440 )); WEEKDAY=$(( (WEEKDAY + 1) % 7 )); fi
  if [ "$t" -lt 0 ]; then t=$(( t + 1440 )); WEEKDAY=$(( (WEEKDAY + 6) % 7 )); fi
  H=$(( t / 60 )); M=$(( t % 60 ))
  WHEN="$UTC UTC (this Mac is at UTC$OFF now: rerun after a daylight-saving change)"
else
  read -r H M <<<"$(hm "$AT")"
  WHEN="$AT local (follows daylight saving by itself)"
fi

# The real claude executable (an interactive zsh aliases `claude` to the claude-anthropic function; this script
# runs in bash, where `command -v` finds the binary itself).
CLAUDE_BIN=${CLAUDE_BIN:-$(command -v claude 2>/dev/null || true)}
[ -n "$CLAUDE_BIN" ] || CLAUDE_BIN="$HOME/.local/bin/claude"
[ -x "$CLAUDE_BIN" ] || die "claude not found (set CLAUDE_BIN)"

# PATH for the job: where node, npm, gh, git and claude are now, then the system dirs.
JOB_PATH=""
for c in node npm gh git; do
  p=$(command -v "$c" 2>/dev/null || true)
  [ -n "$p" ] || die "$c not found on PATH"
  d=$(dirname "$p")
  case ":$JOB_PATH:" in *":$d:"*) ;; *) JOB_PATH="${JOB_PATH:+$JOB_PATH:}$d" ;; esac
done
d=$(dirname "$CLAUDE_BIN"); case ":$JOB_PATH:" in *":$d:"*) ;; *) JOB_PATH="$JOB_PATH:$d" ;; esac
for d in /opt/homebrew/bin /usr/local/bin /usr/bin /bin /usr/sbin /sbin; do
  case ":$JOB_PATH:" in *":$d:"*) ;; *) JOB_PATH="$JOB_PATH:$d" ;; esac
done

OUT=$(mktemp -d "${TMPDIR:-/tmp}/respite-content-launchd.XXXXXX")
trap 'rm -rf "$OUT"' EXIT
sed -e "s|__SCRIPT_DIR__|$INSTALL_DIR|g" -e "s|__WEEKDAY__|$WEEKDAY|g" -e "s|__HOUR__|$H|g" -e "s|__MINUTE__|$M|g" \
    -e "s|__PATH__|$JOB_PATH|g" -e "s|__LOG_DIR__|$LOG_DIR|g" -e "s|__CLAUDE_BIN__|$CLAUDE_BIN|g" -e "s|__CHECKOUT__|$CHECKOUT|g" \
    "$HERE/launchd/$LABEL.plist" > "$OUT/$LABEL.plist"
plutil -lint "$OUT/$LABEL.plist" >/dev/null || die "the filled $LABEL.plist is not valid"
DAYS=(Sunday Monday Tuesday Wednesday Thursday Friday Saturday Sunday)
printf '%-30s %s at %02d:%02d local — %s\n' "$LABEL" "${DAYS[$WEEKDAY]}" "$H" "$M" "$WHEN"
say "claude: $CLAUDE_BIN"
say "PATH:   $JOB_PATH"

if [ "$DRY" = 1 ]; then
  say ""; say "--- $LABEL.plist (would go to $AGENTS)"; sed -n '/<plist/,$p' "$OUT/$LABEL.plist"
  say ""; say "(dry run: nothing copied or loaded; weekly.sh would be copied to $INSTALL_DIR)"
  exit 0
fi

mkdir -p "$INSTALL_DIR/launchd" "$AGENTS" "$LOG_DIR"
cp "$HERE/weekly.sh" "$HERE/README.md" "$INSTALL_DIR/"
cp "$HERE/launchd/$LABEL.plist" "$INSTALL_DIR/launchd/"
chmod +x "$INSTALL_DIR/weekly.sh"
launchctl bootout "gui/$(id -u)/$LABEL" >/dev/null 2>&1 || true
cp "$OUT/$LABEL.plist" "$AGENTS/$LABEL.plist"
if [ "$LOAD" = 1 ]; then
  launchctl bootstrap "gui/$(id -u)" "$AGENTS/$LABEL.plist"
  say "loaded $LABEL"
else
  say "installed, not loaded: launchctl bootstrap gui/$(id -u) \"$AGENTS/$LABEL.plist\""
fi
say "Script: $INSTALL_DIR/weekly.sh   Logs: $LOG_DIR"
say "Run now: launchctl kickstart gui/$(id -u)/$LABEL   (or: bash \"$INSTALL_DIR/weekly.sh\" --dry-run)"
launchctl list | grep "$LABEL" || true
