# Project Guidelines

This project uses the [Electric Book template](https://github.com/electricbookworks/electric-book) (EBT). At the start of each session, ensure the shared EBT agent-context repo is present and current, then follow its guidance.

(`~/.agent-context/` is a conventional location for AI agent context repos — it keeps shared guidance separate from project files and dotfiles.)

1. Clone the context repo if missing, otherwise pull the latest changes:
   ```
   git clone https://github.com/electricbookworks/electric-book-template-context.git ~/.agent-context/ebt \
     || git -C ~/.agent-context/ebt pull
   ```
2. Read and apply `~/.agent-context/ebt/.github/copilot-instructions.md` and the instruction files in `~/.agent-context/ebt/.github/instructions/`.

Confirm with a brief "EBT context loaded." when you have done so.
