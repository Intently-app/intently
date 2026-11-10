# Finished code merges itself

A pull request with the label `auto:merge` merges itself (squash) once the CI checks pass. If its description
names tracker issues with `Closes Intently-app/tracker#N`, the workflow closes them after the merge.

- **A merge to main deploys to production**: the Deploy workflow publishes every site the change touched.
- CI only runs for changes under `apps/`, `packages/` and the root package files, so a PR that touches
  nothing there never merges itself.
- Use `Part of Intently-app/tracker#N` when work remains; the issue then stays open.
- A PR that changes anything under `.github/` is refused; the owner merges those by hand.
- The rule lives in `.github/workflows/ci.yml` (job `automerge`) and in the tracker's `AGENTS.md`.
