# MCP GitHub Guide for Claude

IMPORTANT: Read this before ANY GitHub operations!

## CRITICAL: Start Here

1. NEVER start by trying to write examples of MCP commands into your docs
   - This causes infinite recursion of examples
   - You'll waste time with escaping issues
   - Just describe the parameters in plain text

2. ALWAYS use this exact parameter structure:
   - repo: whiskeywiz
   - owner: nuwud
   - branch: main
   - message: descriptive commit message
   - files: array with {path, content}

3. ALWAYS test first with minimal content:
```json
files: [{
  "path": "test.md",
  "content": "test content"
}]
```

4. Common Errors & Solutions:
   - "Cannot convert undefined or null to object"
     → You forgot owner, branch, or message parameter
   - "Invalid arguments: content.encoding, content.content"
     → You're overcomplicating the content structure

5. NEVER:
   - Try to use create_or_update_file
   - Use base64 encoding
   - Include MCP command examples in content
   - Skip any required parameters
   - Try to get fancy with the format

## Time-Saving Tips

1. Don't experiment! This format works:
   ```typescript
   push_files + {repo, owner, branch, message, files}
   ```

2. Start with the test.md approach above
3. Only after success, try your actual content
4. Keep content simple - no nested code examples!

Note: I had to write this guide 3 times because I kept trying to include example MCP commands in the content. Don't do that!