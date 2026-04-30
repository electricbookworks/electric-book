# Project Guidelines

This project is built on the Electric Book template (EBT). At the start of each
session, ensure the EBT context repo is up to date and load its guidance:

(`~/.agent-context/` is a conventional location for AI agent context repos — it keeps shared guidance separate from project files and dotfiles.)

1. If `~/.agent-context/ebt/` does not exist, clone it:
   ```
   git clone https://github.com/electricbookworks/electric-book-template-context.git ~/.agent-context/ebt
   ```
2. If it already exists, pull the latest changes:
   ```
   cd ~/.agent-context/ebt && git pull
   ```
3. Read and apply the following files as active project guidance:
   - `~/.agent-context/ebt/.github/copilot-instructions.md`
   - `~/.agent-context/ebt/.github/instructions/*`

Confirm with a brief "EBT context loaded." when you have done so.

## Project-specific notes

Read the project's `README.md` for project-specific information.
