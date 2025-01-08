# Docker Transition Cleanup

## Files to Remove
- `node_modules/` directory (will be managed by Docker)
- `.angular/` cache directory
- `coverage/` directory
- Any local npm debug logs
- `.nx/cache/` directory

## Files to Keep
- All source code files
- `package.json` and `package-lock.json`
- `nx.json` and `project.json`
- Firebase configuration files
- `.gitignore` and other Git files
- All configuration files (tsconfig.json, etc.)
- Environment files (but create Docker-specific versions)

## New Docker Files
- `Dockerfile`
- `docker-compose.yml`
- `.env.example` (template for Docker environment variables)
- `.dockerignore`

## Cleanup Commands
```bash
# Remove unnecessary directories
rm -rf node_modules
rm -rf .angular
rm -rf coverage
rm -rf .nx/cache
rm -rf dist

# Clean npm cache
npm cache clean --force

# Remove any debug logs
rm -f npm-debug.log*
rm -f yarn-debug.log*
rm -f yarn-error.log*
rm -f firebase-debug.log*
```

## After Cleanup
1. Build Docker container
2. Run development environment
3. Verify application works
4. Update deployment scripts if needed

## Development Workflow
1. Use `docker-compose up` for development
2. Container will handle node_modules and builds
3. Source code changes reflected through volume mounting
4. Firebase emulator available in container