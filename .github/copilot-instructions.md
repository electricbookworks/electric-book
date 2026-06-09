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

## EBW agent skills

EBW's internal skills library provides workflow guidance (e.g. release checklists,
monthly financials). Clone it if not already present:

1. If `~/.ebw-agent-skills/` does not exist, clone it:
   ```
   gh repo clone electricbookworks/ebw-agent-skills ~/.ebw-agent-skills
   ```
   If the clone fails (e.g. permission denied or not authenticated), inform
   the user: "EBW's internal agent skills are only available to authorised EBW
   collaborators. If you think you should already have access, please contact EBW."
   Then continue the session without skills support.
2. If it already exists, pull the latest changes:
   ```
   cd ~/.ebw-agent-skills && git pull
   ```
3. Read `~/.ebw-agent-skills/skills-index.md` to identify relevant skills for the
   current task. Load a skill only when the task matches its description.

Note: Access to this private repo is granted via the devcontainer's repository
permissions. Users are prompted to authorise access when they first create a
Codespace. Only users with org-level access to `ebw-agent-skills` will succeed.

## Project-specific notes

Read the project's `README.md` for project-specific information.
