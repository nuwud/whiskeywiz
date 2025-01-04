# Whiskey Wiz Development Workflow

## Project Overview

Whiskey Wiz is a web-based whiskey tasting game that:
- Operates on a quarterly basis
- Integrates with Shopify via web components
- Uses Firebase for backend operations
- Supports admin and player interfaces

## Development Environment

### Required Setup
```bash
# Core dependencies
Node.js 16+
Angular CLI 15+
Firebase Tools

# Installation
npm install
```

### Key Commands
```bash
# Development server
ng serve

# Build web components
npm run build:elements

# Deploy to Firebase
npm run deploy
```

## Component Structure

### 1. Web Components
Each quarter gets its own web component:
```typescript
@Component({
  selector: 'whiskey-wiz-{quarterId}'
})
export class QuarterComponent
```

### 2. Feature Modules
```
src/app/
├── admin/           # Admin interface
├── shared/          # Shared components
├── quarters/        # Quarter components
└── services/        # Core services
```

## Development Guidelines

### 1. Creating New Features

#### Quarter Components
```bash
# Generate new quarter
ng g c quarters/Q12024

# Update routing
# Update web component registration
# Test in Shopify environment
```

### 2. Testing Workflow

1. **Local Development**
   - Test with ng serve
   - Verify all routes work
   - Check authentication flows

2. **Web Component Testing**
   - Build elements
   - Test in Shopify preview
   - Verify embedding works

### 3. Deployment Process

1. **Preparation**
   ```bash
   # Update version
   npm version patch
   
   # Build elements
   npm run build:elements
   ```

2. **Testing**
   - Deploy to staging
   - Verify all routes
   - Test Shopify integration

3. **Production**
   ```bash
   # Deploy
   npm run deploy
   ```

## Common Workflows

### 1. Adding New Quarter
```bash
# 1. Generate components
ng g c quarters/Q12024

# 2. Update routing
# 3. Register web component
# 4. Update Firebase rules
# 5. Test deployment
```

### 2. Updating Game Logic
1. Modify game.service.ts
2. Update scoring rules
3. Test with multiple quarters
4. Verify admin interface

### 3. Admin Features
1. Update admin.module.ts
2. Configure new features
3. Test authentication
4. Verify permissions

## Best Practices

### 1. Code Organization
- Keep components focused
- Use shared services
- Maintain clear interfaces

### 2. Firebase Usage
- Use appropriate security rules
- Implement proper error handling
- Monitor quotas and usage

### 3. Authentication
- Always use guards
- Maintain role-based access
- Handle guest sessions

### 4. Shopify Integration
- Test embedding thoroughly
- Verify across themes
- Monitor performance

## Troubleshooting

### 1. Common Issues

#### Routing Problems
```typescript
// Correct
router.navigate(['/path'])

// Incorrect
router.navigate(['/#/path'])
```

#### Service Injection
- Check module providers
- Verify service registration
- Check circular dependencies

### 2. Development Tools
- Chrome DevTools
- Firebase Console
- Angular DevTools

## Maintenance

### 1. Regular Tasks
- Update dependencies
- Review Firebase usage
- Monitor performance
- Update documentation

### 2. Version Control
- Use semantic versioning
- Maintain clear commits
- Document major changes

## Contact & Resources

### 1. Key Links
- Repository: [URL]
- Deployment: whiskeywiz2.web.app
- Shopify Store: [URL]

### 2. Documentation
- Angular docs
- Firebase docs
- Internal wiki

Maintained by: [Your Team]
Last Updated: January 2025