#!/bin/bash
# Removes the weekly content LaunchAgent installed by install-launchd.sh. Logs in ~/Library/Logs/respite-content
# and the off-site drafts are kept.
#
#   content-pipeline/uninstall-launchd.sh [--keep-scripts]
set -euo pipefail
KEEP=0
for a in "$@"; do case "$a" in --keep-scripts) KEEP=1 ;; *) echo "usage: uninstall-launchd.sh [--keep-scripts]" >&2; exit 2 ;; esac; done
LABEL=app.intently.respite.content
INSTALL_DIR=${CONTENT_INSTALL_DIR:-"$HOME/Library/Application Support/respite-content"}
launchctl bootout "gui/$(id -u)/$LABEL" >/dev/null 2>&1 && echo "unloaded $LABEL" || echo "$LABEL was not loaded"
rm -f "$HOME/Library/LaunchAgents/$LABEL.plist"
if [ "$KEEP" = 0 ]; then rm -rf "$INSTALL_DIR"; echo "removed $INSTALL_DIR"; fi
launchctl list | grep "$LABEL" || echo "$LABEL is not loaded"
