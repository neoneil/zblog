# Project Working Notes

- Before making code changes or running project-specific implementation work, automatically check the current git branch. Do not ask the user which branch to use.
- The user's designated development branch is NEO-Backend. Its actual Git branch name is `neo-backend` (lowercase); use this exact name when checking the branch.
- If the current branch is not `neo-backend`, immediately notify the user and pause project code changes. Do not automatically switch branches or modify another contributor's branch.
- Work on a different branch only when the user explicitly requests it.

## Membership And Payments Handoff

- When resuming membership/payment work, including when the user says to continue that task, read `docs/payments/CURRENT-PROGRESS.md`, `docs/payments/AGENTS.md`, and `docs/payments/STRIPE-SETUP.md` first.
- Before implementation, summarize the recorded completed work and the next tasks for the user.
- Recheck local services and test/live mode. Do not automatically replay payments, credit wallets, enable live charging, or execute remote database migrations.
