# Claude MCP Instructions

This document contains instructions for Claude when using MCP functionality. Keep this document updated with new patterns and best practices learned during development.

## Key MCP Operations

### 1. File Operations

#### Reading Files
```typescript
// Always read file content first before modifying
const fileContent = await get_file_contents({
  owner: "nuwud",
  repo: "whiskeywiz",
  path: "path/to/file"
});
```

#### Creating/Updating Files
```typescript
// Create or update a file
await create_or_update_file({
  owner: "nuwud",
  repo: "whiskeywiz",
  path: "path/to/file",
  branch: "feature/branch-name",
  message: "feat: descriptive message",
  content: "file content"
});
```

### 2. Branch Management

#### Creating Feature Branches
```typescript
// Always create a feature branch for changes
await create_branch({
  owner: "nuwud",
  repo: "whiskeywiz",
  branch: "feature/meaningful-name"
});
```

### 3. Best Practices

1. Branch Management:
   - Create feature branches for all changes
   - Use descriptive branch names
   - Keep changes focused and atomic

2. File Operations:
   - Always read files before modifying
   - Include clear commit messages
   - Group related changes together

3. Error Handling:
   - Handle potential file encoding issues
   - Verify file paths carefully
   - Check for existing content before creating new files

4. Documentation:
   - Update this file with new learned patterns
   - Document any workarounds discovered
   - Keep examples current and relevant

### 4. Common Patterns

#### Updating Component Files
```typescript
// 1. Create feature branch
await create_branch({
  owner: "nuwud",
  repo: "whiskeywiz",
  branch: "feature/update-component"
});

// 2. Read current content
const currentContent = await get_file_contents({
  owner: "nuwud",
  repo: "whiskeywiz",
  path: "src/app/components/my.component.ts"
});

// 3. Make updates
await create_or_update_file({
  owner: "nuwud",
  repo: "whiskeywiz",
  path: "src/app/components/my.component.ts",
  branch: "feature/update-component",
  message: "feat: describe changes",
  content: "updated content"
});
```

## Note to Future Claude Sessions

Keep this document updated with:
1. New patterns discovered
2. Improved error handling approaches
3. Better ways to handle file operations
4. Updated best practices

When working with the MCP system:
1. Reference this document for common patterns
2. Add new learned patterns here
3. Update outdated information
4. Keep examples current and accurate

Remember: This is a living document - improve it with each session to make future development more efficient.
