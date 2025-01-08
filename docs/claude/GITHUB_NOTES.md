# GitHub Process Notes for Claude Assistants

## Best Practices for GitHub Integration

### 1. File Pushing Strategy
- Use `push_files` for multiple related files rather than individual `create_or_update_file` calls
- Group related files together in single pushes (e.g., all services together)
- Include clear, descriptive commit messages

### 2. Process Flow
1. First check if files exist:
```typescript
try {
  await get_file_contents({
    path: 'path/to/file',
    repo: 'repo-name',
    owner: 'owner-name'
  });
} catch (error) {
  // File doesn't exist, create new
}
```

2. Push files in logical groups:
```typescript
await push_files({
  repo: 'repo-name',
  owner: 'owner-name',
  branch: 'main',
  message: 'Clear commit message',
  files: [{
    path: 'path/to/file1',
    content: 'file1 content'
  }, {
    path: 'path/to/file2',
    content: 'file2 content'
  }]
});
```

### 3. Error Handling
- Always check function results
- Handle 404 errors when files don't exist
- Verify successful pushes before proceeding

### 4. Content Guidelines
- Keep file content under size limits
- Use proper line endings
- Ensure proper encoding
- Include complete file content (no truncation)

### 5. Common Pitfalls
- Don't use `create_or_update_file` for multiple related changes
- Don't assume files exist without checking
- Don't push partial file contents
- Don't mix unrelated files in single commits

## Example Implementation Flow

1. Check existing files
2. Group related changes
3. Push core functionality first
4. Add supporting files
5. Update documentation last

This process ensures clean, atomic commits and proper error handling.