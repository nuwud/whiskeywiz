# MCP Memory Usage

MCP maintains state between conversations for:
- File contents and changes
- Repository state
- GitHub operations

Leverage this by:
1. Update test.md with session context
2. Reference specific file versions/SHAs
3. Track progress in CHAT_HANDOFF files
4. Document MCP operation patterns that work

Note: Each new Claude chat still needs project docs review, but MCP remembers previous operations.