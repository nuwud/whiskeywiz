# MCP GitHub Guide for Claude

⚠️ CRITICAL FIRST STEP - DO THIS IMMEDIATELY:
1. Stop and read ALL numbered documents first
2. Locate this file (FOR_CLAUDE.md) in the docs
3. Follow these patterns EXACTLY - no experimentation!

## Key Points to Remember
1. ONLY use push_files with this exact structure:
```json
push_files + {
  repo: "whiskeywiz",
  owner: "nuwud",
  branch: "main/feature-branch",
  message: "type: descriptive message",
  files: [{ path, content }]
}
```

2. NEVER:
   - Try create_or_update_file
   - Use base64 encoding
   - Include MCP command examples in content
   - Skip required parameters
   - Experiment with formats

3. ALWAYS:
   - Test first with minimal content
   - Use the exact parameter structure
   - Keep content simple
   - Follow working examples

4. Common Errors Mean:
   - "Cannot convert undefined or null to object"
     → Missing required parameter
   - "Invalid arguments: content.encoding, content.content"
     → Overcomplicating content structure

## Time-Saving Tips
1. Don't experiment - use proven patterns
2. Start with test.md approach
3. Only after success, add real content
4. Keep content simple - no nested examples

Note: This exists to prevent wasting limited Claude time with trial and error!