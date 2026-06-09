# Project Guidelines

This project uses the [Electric Book template](https://github.com/electricbookworks/electric-book) (EBT).

**Before responding to your first request in a session — even a direct question — you must first ensure the shared EBT agent-context repo is present, then follow its guidance.** Do not answer project questions until this is done; the context repo may change how you answer.

(`~/.agent-context/` is a conventional location for AI agent context repos — it keeps shared guidance separate from project files and dotfiles.)

1. Clone the context repo if missing, otherwise pull the latest changes:
   ```
   git clone https://github.com/electricbookworks/electric-book-template-context.git ~/.agent-context/ebt \
     || git -C ~/.agent-context/ebt pull
   ```
2. Read and apply `~/.agent-context/ebt/.github/copilot-instructions.md` and the instruction files in `~/.agent-context/ebt/.github/instructions/`.
3. Only after the clone/pull succeeds and you have read those files, confirm with a brief "EBT context loaded." and then address the user's request.
