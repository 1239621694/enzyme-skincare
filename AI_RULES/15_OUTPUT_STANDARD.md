# Output Standard

## Every Response Must Contain

After completing a task, output in this exact format:

```
## Summary
[One sentence describing what was done]

## Files Read
[file1]
[file2]

## Files Modified
[file1] — [what changed]
[file2] — [what changed]

## Reason
[Why the change was made]

## Verification
[Build status / test result / confirmation]

## Remaining Risks
[Any issues or concerns]

## Next Step
[Suggested next action, or "None — task complete"]
```

## Output Rules
- Never output the full content of a file unless asked
- Never output analysis that doesn't lead to an action
- Never repeat what the user said
- Be concise — prefer bullet points over paragraphs
- If nothing was modified, say "No changes made"
