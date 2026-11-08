# LIMO Visionary Architects — Integration and project documentation

## Assigned work
Own build/test instructions, GitHub Pages verification, accurate AI disclosure, merge coordination and milestone evidence. Ensure claims of passing tests match actual runs.

## Files in this package
- `README.md`
- `docs/AI_USE.md`
- `.github/workflows/pages.yml`
- `docs/M3_PIPELINE_CORE.md`

## Git workflow
Start from the team's M3 branch:
```bash
git fetch origin
git switch -c feature/m3-integration origin/feature/m3
```
Edit the assigned files in a full clone of the repository, test the actual implementation, and commit only files you changed:
```bash
git add <specific-changed-files>
git commit -m "Improve and verify integration and project documentation"
git push -u origin feature/m3-integration
```
Open a pull request targeting `feature/m3`. Do not overwrite the project with this partial package: it is a focused assignment/reference extract, not a standalone runnable repository.

## Important
- The frozen ISA must not be changed.
- Existing code remains credited to its original author; your commit must represent work you actually did.
- Shared `app.js` edits require coordination.
- Run tests and describe what you personally verified.
