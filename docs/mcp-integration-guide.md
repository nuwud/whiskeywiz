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
└── mcp-datavis/
```

### Installed MCPs
- @modelcontextprotocol/server-github
- @modelcontextprotocol/server-brave-search
- @modelcontextprotocol/server-filesystem
- @modelcontextprotocol/server-puppeteer
- @simonb97/server-win-cli
- airtable-mcp-server

## MCP Integration Patterns

### 1. GitHub MCP
Primary use: Version Control & Project Management

```typescript
// Examples:

// Feature branch workflow
const createFeature = async (featureName: string) => {
  await create_branch({
    owner: 'nuwud',
    repo: 'whiskeywiz',
    branch: `feature/${featureName}`
  });
};

// Automated PR creation
const submitFeature = async (featureName: string) => {
  await create_pull_request({
    owner: 'nuwud',
    repo: 'whiskeywiz',
    title: `Feature: ${featureName}`,
    head: `feature/${featureName}`,
    base: 'main'
  });
};
```

### 2. Filesystem MCP
Primary use: Local Development & Build Process

```typescript
// Examples:

// Build process helper
const buildProject = async () => {
  // Clean dist
  await create_directory({
    path: 'C:\\Users\\nuwud\\whiskeywiz\\dist'
  });

  // Read configurations
  const configs = await read_multiple_files({
    paths: [
      'C:\\Users\\nuwud\\whiskeywiz\\firebase.json',
      'C:\\Users\\nuwud\\whiskeywiz\\next.config.js'
    ]
  });
};
```

### 3. Firebase MCP
Primary use: Backend Services

```typescript
// Examples:

// Auth workflows
const handleAuth = async () => {
  const config = await read_file({
    path: 'C:\\Users\\nuwud\\AppData\\Roaming\\Claude\\firebase-credentials\\firebase-config.json'
  });
};
```

### 4. Puppeteer MCP
Primary use: Testing & Validation

```typescript
// Examples:

// E2E test suite
const testAuthFlow = async () => {
  await puppeteer_navigate({
    url: 'http://localhost:3000/auth/signin'
  });

  await puppeteer_fill({
    selector: '#email',
    value: 'test@example.com'
  });

  await puppeteer_screenshot({
    name: 'auth-flow',
    selector: '#signin-form'
  });
};
```

### 5. Windows-CLI MCP
Primary use: Build & Deploy Automation

```typescript
// Examples:

// Deployment script
const deployToFirebase = async () => {
  await execute_command({
    shell: 'cmd',
    command: 'firebase deploy',
    workingDir: 'C:\\Users\\nuwud\\whiskeywiz'
  });
};
```

## Testing & Verification

### MCP Test Suite
```typescript
const testAllMCPs = async () => {
  // Test GitHub
  await testGitHubAccess();
  
  // Test Filesystem
  await testFileOperations();
  
  // Test Firebase
  await testFirebaseConnection();
  
  // Test Puppeteer
  await testBrowserAutomation();
  
  // Test CLI
  await testCommandExecution();
};
```

## Backup & Recovery

### Using GDrive MCP
```typescript
const backupConfigs = async () => {
  // Backup firebase configs
  const configContent = await read_file({
    path: 'C:\\Users\\nuwud\\AppData\\Roaming\\Claude\\firebase-credentials\\firebase-config.json'
  });

  // Store in GDrive
  await gdrive.upload({
    name: 'firebase-config-backup.json',
    content: configContent,
    mimeType: 'application/json'
  });
};
```

## Best Practices

1. Version Control:
   - Use GitHub MCP for all code changes
   - Create feature branches
   - Submit PRs for review

2. Development Workflow:
   - Use Filesystem MCP for local operations
   - Keep config files secure
   - Regular backups with GDrive

3. Testing:
   - Use Puppeteer for E2E tests
   - Regular integration testing
   - Screenshot comparisons

4. Deployment:
   - Use Windows-CLI for automation
   - Verify configurations
   - Monitor deployment status

## Troubleshooting

1. MCP Connection Issues:
```powershell
# Verify MCP server status
npx @modelcontextprotocol/server-github --status
```

2. Build Problems:
```powershell
# Clean installation
npm cache clean --force
npm install
```

3. Deployment Failures:
```powershell
# Verify Firebase config
firebase list
firebase use whiskeywiz2
```

## Regular Maintenance

1. Update MCPs:
```powershell
npm update @modelcontextprotocol/server-github
npm update @modelcontextprotocol/server-filesystem
```

2. Backup Configs:
```powershell
# Regular config backups
Copy-Item "$baseDir\firebase-credentials\*" "$baseDir\backups"
```

3. Clean Old Builds:
```powershell
Remove-Item "$baseDir\..\whiskeywiz\dist" -Recurse -Force
```