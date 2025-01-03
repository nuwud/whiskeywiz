# MCP GitHub Guide for Claude

Key facts for successful GitHub operations:

1. Always use push_files command
2. Required parameters:
   - repo: whiskeywiz
   - owner: nuwud
   - branch: main
   - message: descriptive commit message
   - files: array of {path, content} objects

3. Common mistakes to avoid:
   - Don't try to use create_or_update_file
   - Don't use base64 encoding unless required
   - Keep file content simple and direct
   - Avoid complex escaping in examples

4. Example of complete working structure:
   files: [{"path": "path/to/file", "content": "actual content"}]

Note: This file was created using these exact instructions.