# WhiskeyWiz

## Project Configuration

### Important Note on Project Configuration
🚨 **Angular Configuration Alert** 🚨

This project uses Nx workspace with `project.json` instead of the traditional `angular.json`. If you're looking for project configuration:

- **Do NOT use `angular.json`**
- **Use `project.json` for build and development settings**

The `project.json` file contains all the build, serve, and test configurations for this Angular project.

### Quick Links
- [Nx Documentation](https://nx.dev)
- [Angular Nx Guide](https://nx.dev/angular/overview)

## Development Setup

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

## Build and Deployment

Use Nx commands for building:
```bash
nx build
nx serve
nx test
```

## Troubleshooting

If you encounter configuration-related issues:
- Check `project.json`
- Verify Nx and Angular CLI versions
- Ensure Node.js is compatible with the project's Angular version
