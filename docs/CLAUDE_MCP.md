# Claude MCP Usage Guide for Whiskey Wiz Project

## Available Commands
- `read_file`: Read file contents
- `write_file`: Create/update files
- `create_directory`: Create new directories
- `list_directory`: List directory contents
- `search_files`: Search for files
- `get_file_info`: Get file metadata

## Project Structure
```
/whiskeywiz
├── src/
│   └── app/
│       ├── shared/
│       ├── quarters/
│       └── services/
└── docs/
```

## Common Operations
1. Reading TypeScript files:
```typescript
<function_calls>
<invoke name="read_file">
<parameter name="path">C:/Users/nuwud/whiskeywiz/src/app/[path]