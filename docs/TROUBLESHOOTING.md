# Whiskey Wiz Troubleshooting Guide

## Common Issues & Solutions

### 1. NullInjectorError

#### Symptoms
```
NullInjectorError: No provider for 'rr'
```

#### Causes
1. Missing service provider
2. Circular dependency
3. Incorrect module imports

#### Solutions
1. Check module providers:
```typescript
@NgModule({
  providers: [
    FirebaseService,
    AuthService,
    GameService,
    ScoreService
  ]
})
```

2. Verify service imports in feature modules
3. Check for circular dependencies

### 2. Routing Issues

#### Symptoms
- Pages redirect to base URL
- Hash navigation fails
- Admin component not loading

#### Solutions
1. Use correct navigation syntax:
```typescript
// Correct
this.router.navigate(['/admin'])

// Incorrect
this.router.navigate(['/#/admin'])
```

2. Check lazy loading setup:
```typescript
{
  path: 'admin',
  loadChildren: () => import('./admin/admin.module')
    .then(m => m.AdminModule)
}
```

### 3. Firebase Integration

#### Symptoms
- Authentication fails
- Data not loading
- Permissions errors

#### Solutions
1. Check Firebase initialization
2. Verify security rules
3. Check service methods

### 4. Web Component Issues

#### Symptoms
- Components not registering
- Shopify embedding fails
- Styling conflicts

#### Solutions
1. Verify build process:
```bash
npm run build:elements
```

2. Check component registration:
```typescript
customElements.define('whiskey-wiz-q12024', QuarterComponent)
```

### 5. Authentication Flows

#### Symptoms
- Guards not working
- Admin access denied
- Session persistence issues

#### Solutions
1. Verify guard implementation
2. Check auth service methods
3. Test Firebase auth rules

### 6. Performance Issues

#### Symptoms
- Slow loading times
- Unresponsive UI
- Memory leaks

#### Solutions
1. Implement lazy loading
2. Use proper unsubscribe patterns
3. Optimize Firebase queries

## Quick Fixes

### 1. Reset Development Environment
```bash
# Clear cache
npm cache clean --force

# Remove node_modules
rm -rf node_modules

# Fresh install
npm install
```

### 2. Firebase Reset
```bash
# Logout and login
firebase logout
firebase login

# Clear cache
firebase use --clear
```

### 3. Angular Cache Clear
```bash
# Clear Angular cache
ng cache clean
```

## Debugging Tools

### 1. Browser Tools
- Chrome DevTools
- Angular DevTools extension
- Firebase Console

### 2. CLI Tools
```bash
# Check Angular version
ng version

# List Firebase projects
firebase projects:list

# Check deployment status
firebase hosting:channel:list
```

## Prevention Tips

### 1. Development
- Use TypeScript strict mode
- Implement proper error handling
- Maintain clear service boundaries

### 2. Testing
- Test all routes
- Verify authentication flows
- Check component integration

### 3. Deployment
- Use staging environment
- Test web component builds
- Verify Shopify integration

## Support Resources

### Documentation
- Angular: angular.io/docs
- Firebase: firebase.google.com/docs
- Project Wiki: [Internal Link]

### Tools
- Firebase Console
- Angular CLI
- Chrome DevTools

### Contact
- Team Lead: [Contact]
- Firebase Support: [Link]
- Angular Support: [Link]

Maintained by: [Your Team]
Last Updated: January 2025