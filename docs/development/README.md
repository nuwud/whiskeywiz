# Development Guide

## Setup

### Prerequisites
- Node.js 20.x
- Docker & Docker Compose
- Firebase CLI
- VS Code (recommended)

### Local Development
```bash
# Start Docker environment
docker-compose up

# Manual setup
npm install
npx nx serve whiskey-wiz
firebase emulators:start
```

## Development Workflow

### Creating New Quarters
1. Use standard template:
```typescript
export class Q[MMYY]Component extends BaseQuarterComponent {
  @Input() override quarterId: string = '[MMYY]';
  @Input() override quarterName: string = '[Month YYYY]';

  constructor(
    firebaseService: FirebaseService,
    authService: AuthService,
    analyticsService: AnalyticsService
  ) {
    super(firebaseService, authService, analyticsService);
  }
}
```

2. Add to routing module
3. Configure in Firebase

### Testing
```bash
# Unit tests
npx nx test whiskey-wiz

# E2E tests
npx nx e2e whiskey-wiz-e2e

# Firebase emulators
firebase emulators:start
```

### Best Practices
1. Core Rules:
   - Always extend BaseQuarterComponent
   - Use Firebase service wrappers
   - Follow MMYY naming
   - Update documentation

2. Code Style:
   - Use TypeScript strictly
   - Write unit tests
   - Document public APIs
   - Follow Angular style guide

3. Firebase Usage:
   - Use emulators for development
   - Test security rules
   - Validate data schemas
   - Monitor quotas

## Environment Setup
```typescript
// environment.ts
export const environment = {
  production: false,
  firebase: {
    projectId: 'whiskeywiz2',
    // ... other config
  },
  useEmulators: true
};
```

## Common Tasks
- [Adding New Features](features.md)
- [Testing Guide](testing.md)
- [Firebase Integration](firebase.md)
- [Troubleshooting](troubleshooting.md)