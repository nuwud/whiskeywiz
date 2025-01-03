# MCP GitHub Guide for Claude

IMPORTANT: Skip all experimentation and read this first!

## The Only Pattern You Need

1. ALWAYS use push_files (never try create_or_update_file)
2. ALWAYS include these parameters:
   - repo: whiskeywiz
   - owner: nuwud
   - branch: main
   - message: your commit message
   - files: array with {path, content}

3. ALWAYS test with a simple file first:
   - Use a simple .md file
   - Keep content basic
   - Verify success before attempting complex content

4. DON'T:
   - Try to use base64 encoding
   - Include example code in content
   - Experiment with different formats
   - Skip any required parameters

## Common Error Prevention

DON'T waste time like I did with these common mistakes:

1. If you see "Invalid arguments: content.encoding, content.content" error:
   - You're missing one of the required parameters
   - Double-check all parameters are present
   - Start with a minimal test file

2. DON'T try to:
   - Include complex code examples (causes escaping issues)
   - Use create_or_update_file (always fails)
   - Skip the message parameter
   - Use partial parameters

## Working Example

This file was created with exactly:
```
files: [{
  "path": "docs/FOR_CLAUDE.md",
  "content": "actual content here"
}]
```

No other format is needed. This works. Test it first with a simple file before trying anything complex.