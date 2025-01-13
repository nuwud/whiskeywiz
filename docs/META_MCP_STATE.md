# MCP Understanding State

## Core MCP Usage Patterns

### GitHub MCP
```typescript
// Correct pattern for file operations
await push_files({
  repo: "whiskeywiz",
  owner: "nuwud",
  files: [{ path: "file.txt", content: "content" }],
  branch: "branch-name",
  message: "commit message"
});

// Correct pattern for branch operations
await create_branch({
  repo: "whiskeywiz",
  owner: "nuwud",
  branch: "new-branch"
});
```

### Filesystem MCP
```typescript
// Correct paths from config
const allowedPaths = [
  "C:\\Users\\nuwud\\whiskeywiz",
  "C:\\Users\\nuwud\\AppData\\Roaming\\Claude"
];

// Correct read pattern
await read_file({
  path: "C:\\Users\\nuwud\\whiskeywiz\\src\\config.ts"
});
```

### Firebase MCP
```typescript
// Available through config:
const firebaseConfig = {
  apiKey: "AIzaSyCqZMaGpJGf5veYgTXmytg1bLerva-of0U",
  projectId: "whiskeywiz2",
  // ... other configs available
};
```

### Brave Search MCP
```typescript
// Example usage:
await brave_web_search({
  query: "search term",
  count: 10  // Max 20
});
```

## Critical MCP Understanding

1. Available MCPs:
- `github`: Version control operations
- `filesystem`: Local file management
- `brave-search`: Web search capabilities
- `puppeteer`: Browser automation
- `firebase`: Backend operations
- `windows-cli`: System commands

2. MCP Access Patterns:
- Use correct function names exactly as shown
- Always handle errors appropriately
- Check credentials before operations

3. MCP Integration Points:
- GitHub for all repository operations
- Filesystem for local development
- Firebase for backend services
- Puppeteer for testing

## File Access Points

1. Project Root:
`C:\Users\nuwud\whiskeywiz`

2. Claude Configuration:
`C:\Users\nuwud\AppData\Roaming\Claude`

3. Repository Remote:
`https://github.com/nuwud/whiskeywiz`

## Current Branch Information

1. Active Branch: `clean-rebuild`
2. Base Branch: `main`

## Security Considerations

1. Available Credentials:
- GitHub PAT configured
- Firebase config available
- Brave Search API key set

2. Protected Information:
- Firebase API keys are public (expected)
- Google Cloud credentials configured

## Error Handling Patterns

```typescript
// Correct error handling for MCPs
try {
  await mcp_operation();
} catch (error) {
  if (error.message.includes("authentication")) {
    // Handle auth errors
  } else if (error.message.includes("permission")) {
    // Handle permission errors
  }
}
```

## Recovery Procedures

1. If GitHub MCP fails:
```typescript
// Verify connection
await create_branch({
  repo: "whiskeywiz",
  owner: "nuwud",
  branch: "test-connection"
});
```

2. If Filesystem MCP fails:
```typescript
// Check access
await list_directory({
  path: "C:\\Users\\nuwud\\whiskeywiz"
});
```

## Next Steps Guide

1. Read project state:
```typescript
// Get latest state
await get_file_contents({
  repo: "whiskeywiz",
  owner: "nuwud",
  path: "docs/SESSION_STATE.md"
});
```

2. Verify MCP access:
```typescript
// Check all MCPs
await checkMcpServices();
```

3. Continue development:
```typescript
// Get latest code
await get_file_contents({
  repo: "whiskeywiz",
  owner: "nuwud",
  path: "src/lib/mcp-manager.ts"
});
```

## Important Reminders

1. Always use MCPs instead of direct operations
2. Check SESSION_STATE.md for project context
3. Verify MCP status before operations
4. Use proper error handling patterns
5. Maintain security best practices