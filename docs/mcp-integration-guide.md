# WhiskeyWiz MCP Integration Guide

## Setup and Configuration

### Directory Structure
```
C:\Users\nuwud\AppData\Roaming\Claude
├── firebase-credentials/
│   └── firebase-config.json
├── mcp-memory/
│   ├── chroma_db/
│   └── backups/
├── mcp-datavis/
├── mcp-sqlite/
├── mcp-docker/
├── mcp-openapi/
└── memory-mesh/data/
```

## Core MCPs

### 1. GitHub MCP
**Config:**
```json
{
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-github"],
  "env": {
    "GITHUB_PERSONAL_ACCESS_TOKEN": "[PAT]"
  }
}
```
Use for version control, project management, and code deployment.

### 2. Firebase MCP
**Config:**
```json
{
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-firebase"],
  "env": {
    "FIREBASE_CONFIG_PATH": "[path]/firebase-config.json",
    "FIREBASE_API_KEY": "[key]",
    // Additional Firebase config...
  }
}
```
Handles authentication, database operations, and hosting.

### 3. Filesystem MCP
**Config:**
```json
{
  "command": "npx",
  "args": [
    "-y",
    "@modelcontextprotocol/server-filesystem",
    "C:\\Users\\nuwud\\whiskeywiz",
    // Additional allowed paths...
  ]
}
```
Manages local file operations and build processes.

## Development Tools

### 1. Puppeteer MCP
```json
{
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-puppeteer"]
}
```
Provides browser automation for testing.

### 2. Windows-CLI MCP
```json
{
  "command": "npx",
  "args": ["-y", "@simonb97/server-win-cli"]
}
```
Automates system commands and deployments.

### 3. Docker MCP
```json
{
  "command": "uv",
  "args": [
    "--directory",
    "[path]/mcp-docker",
    "run",
    "mcp-server-docker"
  ]
}
```
Manages containerization and deployment.

## Data Management

### 1. SQLite MCP
```json
{
  "command": "uv",
  "args": [
    "--directory",
    "[path]/mcp-sqlite",
    "run",
    "mcp-server-sqlite",
    "--db-path",
    "[path]/data.db"
  ]
}
```
Local database operations and caching.

### 2. Airtable MCP
```json
{
  "command": "npx",
  "args": ["-y", "airtable-mcp-server", "[PAT]"]]
}
```
External data management and collaboration.

### 3. Neo4j Memory MCP
```json
{
  "command": "npx",
  "args": ["-y", "@neo4j-contrib/mcp-neo4j-memory"],
  "env": {
    "NEO4J_URI": "[uri]",
    "NEO4J_USERNAME": "[username]",
    "NEO4J_PASSWORD": "[password]"
  }
}
```
Graph database for complex data relationships.

## Documentation & Knowledge

### 1. Brave Search MCP
```json
{
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-brave-search"],
  "env": {
    "BRAVE_API_KEY": "[key]"
  }
}
```
Web search and research capabilities.

### 2. GDrive MCP
```json
{
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-gdrive"]
}
```
Document storage and collaboration.

### 3. Notion MCP
```json
{
  "command": "npx",
  "args": ["-y", "notion-server"],
  "env": {
    "NOTION_API_KEY": "[key]"
  }
}
```
Knowledge base and documentation.

## Project Management

### 1. Linear MCP
```json
{
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-linear"],
  "env": {
    "LINEAR_API_KEY": "[key]"
  }
}
```
Issue tracking and project management.

### 2. Todoist MCP
```json
{
  "command": "npx",
  "args": ["-y", "@abhiz123/todoist-mcp-server"],
  "env": {
    "TODOIST_API_TOKEN": "[token]"
  }
}
```
Task management and personal organization.

## Memory & Context

### 1. Memory MCP
```json
{
  "command": "uvx",
  "args": ["--directory", "[path]/mcp-memory-service", "run", "memory"],
  "env": {
    "MCP_MEMORY_CHROMA_PATH": "[path]/chroma_db",
    "MCP_MEMORY_BACKUPS_PATH": "[path]/backups"
  }
}
```
Project context and knowledge persistence.

### 2. Memory-Mesh MCP
```json
{
  "command": "npx",
  "args": ["-y", "memory-mesh"],
  "env": {
    "MEMORY_MESH_PATH": "[path]/memory-mesh/data"
  }
}
```
Enhanced memory capabilities with mesh structure.

## Integration Examples

### 1. Development Workflow
```typescript
// Create feature branch
await github.create_branch({
  branch: 'feature/new-feature'
});

// Update files
await filesystem.write_file({
  path: 'src/components/NewFeature.tsx',
  content: '// Component code'
});

// Test changes
await puppeteer.navigate({
  url: 'http://localhost:3000/new-feature'
});

// Deploy
await windows_cli.execute({
  command: 'npm run deploy'
});
```

### 2. Documentation Flow
```typescript
// Search references
const results = await brave_search.search({
  query: 'firebase auth best practices'
});

// Update docs
await notion.updatePage({
  pageId: 'auth-docs',
  content: results.summary
});

// Save to GDrive
await gdrive.uploadFile({
  name: 'auth-documentation.md',
  content: results.markdown
});
```

### 3. Task Management
```typescript
// Create Linear issue
await linear.createIssue({
  title: 'Implement new feature',
  description: 'Details here'
});

// Add to Todoist
await todoist.createTask({
  content: 'Review new feature PR',
  due_string: 'tomorrow'
});
```

## Best Practices

1. Version Control
- Use GitHub MCP for all code changes
- Create feature branches
- Maintain clean commit history

2. Documentation
- Store in both Notion and GDrive
- Use Brave Search for research
- Keep documentation up-to-date

3. Testing
- Puppeteer for E2E tests
- Firebase for integration tests
- Regular test automation

4. Deployment
- Docker for containerization
- Windows-CLI for automation
- Firebase for hosting

5. Data Management
- SQLite for local data
- Neo4j for relationships
- Airtable for collaboration

## Troubleshooting

### MCP Connection Issues
```powershell
# Verify server status
npx @modelcontextprotocol/server-github --status
```

### Build Problems
```powershell
# Clean build
Remove-Item -Recurse -Force .next
npm run build
```

### Memory Issues
```powershell
# Clear memory cache
Remove-Item "$baseDir\mcp-memory\chroma_db" -Recurse -Force
```

## Maintenance

### Regular Updates
```powershell
# Update all MCPs
npm update @modelcontextprotocol/server-*
```

### Backups
```powershell
# Backup configs
Copy-Item "$baseDir\firebase-credentials\*" "$baseDir\backups"
```

### Clean Up
```powershell
# Clean old builds
Remove-Item "dist" -Recurse -Force
Remove-Item ".next" -Recurse -Force
```