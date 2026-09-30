# Git Commit Instructions

Whenever the user asks to "provide a git commit" or for a git commit message, you MUST:

1. Always provide the complete set of commands: `git add .`, `git commit`, and `git push`.
2. Ensure the commands are formatted inside a single standard fenced markdown code block with the `bash` language tag (e.g. ````bash ... ````).
3. The code block must be directly executable and terminal-clickable so that the IDE displays the terminal insertion button (`>_`), allowing the user to click and paste/run it directly into their terminal.

Example format:

```bash
git add .
git commit -m "feat/fix: <title>" -m "<description>"
git push
```

Ensure you provide a clear and descriptive commit message based on the recent changes.
