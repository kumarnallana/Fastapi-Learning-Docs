# Git Commit Instructions

At the end of EVERY response, you MUST:

1. Always provide the complete set of commands: `git add .`, `git commit`, and `git push`.
2. Ensure the commit message is **human-written, natural, clean, and authentic**:
   - Must look like it was written directly by the developer, NEVER AI-generated or robotic.
   - Avoid buzzwords, corporate fluff, or essay-like descriptions.
   - Use clean, standard conventional commit style (`feat(scope): concise title` / `fix(scope): concise title`).
   - Keep it short, high-signal, and recruiter-friendly (1 clear title and 1 brief, natural bullet point).
3. Ensure the commands are formatted inside a single standard fenced markdown code block with the `bash` language tag (e.g. ````bash ... ````).
4. The code block must be directly executable and terminal-clickable so that the IDE displays the terminal insertion button (`>_`), allowing the user to click and paste/run it directly into their terminal.

Example format:

```bash
git add .
git commit -m "feat(employees): add optional salary query filter" -m "- Forward salary filter from router to service logic"
git push
```


