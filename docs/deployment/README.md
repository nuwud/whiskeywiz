# Deployment Guide

## GitHub Actions CI/CD

### Production Deployment
- Trigger: Push to main branch
- Process:
  1. Builds application
  2. Runs tests
  3. Deploys to Firebase
  4. Updates GitHub status

### Preview Deployments
- Trigger: Pull Request
- Creates temporary deployment
- Provides preview URL
- Auto-cleanup on PR close

## Manual Deployment
```bash
# Build
npx nx build whiskey-wiz --prod

# Deploy
firebase deploy
```

## Environment Configuration

### Production
```typescript
export const environment = {
  production: true,
  firebase: {
    projectId: 'whiskeywiz2',
    apiKey: '...',
    // ... other config
  }
};
```

### Development
```typescript
export const environment = {
  production: false,
  firebase: {
    // ... config
  },
  useEmulators: true
};
```

## Deployment Checklist
1. Pre-deployment:
   - Run all tests
   - Check bundle size
   - Verify environment
   - Test emulators

2. Deployment:
   - Update documentation
   - Tag release
   - Monitor rollout
   - Check analytics

3. Post-deployment:
   - Verify functionality
   - Check performance
   - Monitor errors
   - Update status

## Rollback Procedure
1. Using Firebase Console
2. Using CLI
3. Emergency procedures

## Monitoring
- Firebase Analytics
- Error tracking
- Performance monitoring
- User feedback

## Detailed Guides
- [Release Process](release.md)
- [Monitoring Guide](monitoring.md)
- [Rollback Procedures](rollback.md)
- [Security Checklist](security.md)