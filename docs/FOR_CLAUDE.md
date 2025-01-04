# MCP GitHub Guide for Claude

## 💬 RECOMMENDED CHAT STARTER:
"Please read and apply doc/FOR_CLAUDE.md in the numbered documents first, then let me know you're ready to help with the Whiskey Wiz game. We have existing implementation code and are currently working on improving the game's navigation and integration components."

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
   - Document changes in appropriate .md files

4. Common Errors Mean:
   - "Cannot convert undefined or null to object"
     → Missing required parameter
   - "Invalid arguments: content.encoding, content.content"
     → Overcomplicating content structure

## Project Conventions
1. Quarter ID Format: MMYY (e.g., 0324 for March 2024)
2. Component Naming: Q{MMYY}Component (e.g., Q0324Component)
3. Web Component Tags: whiskey-wiz-{mmyy} (e.g., whiskey-wiz-0324)

## Documentation Practices
1. Create dedicated fix documentation (e.g., ROUTING_FIX_JAN2025.md)
2. Update DEVELOPMENT_NOTES.md for architectural changes
3. Add context to CHAT_HANDOFF_JAN2025.md for session transitions

## Time-Saving Tips
1. Don't experiment - use proven patterns
2. Start with test.md approach
3. Only after success, add real content
4. Keep content simple - no nested examples
5. Document changes immediately

Note: This exists to prevent wasting limited Claude time with trial and error!