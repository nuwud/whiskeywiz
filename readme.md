# WhiskeyWiz

## 👋 HEY CLAUDE! START HERE!
Before doing ANYTHING else:
1. READ docs/FOR_CLAUDE.md FIRST
2. ALWAYS verify files exist before suggesting changes
3. NEVER modify core game rules or patterns
4. Each quarter has EXACTLY 4 samples (A, B, C, D)
5. Quarter IDs are ALWAYS MMYY format (e.g., 0324)

## For Human Developers

### Project Configuration
🚨 **Angular Configuration Alert** 🚨

This project uses Nx workspace with `project.json` instead of the traditional `angular.json`. If you're looking for project configuration:

- **Do NOT use `angular.json`**
- **Use `project.json` for build and development settings**

### Quick Links
- [Project Documentation](docs/FOR_CLAUDE.md)
- [Architecture Overview](docs/ARCHITECTURE_JAN2025.md)
- [Nx Documentation](https://nx.dev)
- [Angular Nx Guide](https://nx.dev/angular/overview)

### Development Setup
1. Ensure you have Nx CLI installed:
   ```bash
   npm install -g @nrwl/cli
   ```

2. Install project dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   nx serve
   ```

### Build and Deployment
Use Nx commands for building:
```bash
nx build
nx serve
nx test
```

### Troubleshooting
If you encounter configuration-related issues:
- Check `project.json`
- Verify Nx and Angular CLI versions
- Ensure Node.js is compatible with the project's Angular version

## About WhiskeyWiz
This is a quarterly whiskey tasting game where players:
- Receive 4 whiskey samples each quarter
- Guess age, proof, and mashbill for each
- Earn points based on accuracy
- Can share their results

The game integrates with Shopify via web components and uses Firebase for the backend.

## For Claude: File Verification
ALWAYS use these commands to verify files before suggesting changes:
```typescript
// Check if files exist:
<function_calls>
<invoke name="list_directory">
<parameter name="path">path/to/check</parameter>
</invoke>

// Read file contents:
<function_calls>
<invoke name="read_file">
<parameter name="path">file/to/read</parameter>
</invoke>
```

Remember: VERIFY FIRST, suggest changes second!