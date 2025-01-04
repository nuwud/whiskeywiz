# Whiskey Wiz Development Notes

## Major Architecture Decisions

### January 2025

1. Firebase Initialization
   - Using Angular provider pattern exclusively
   - Configuration in environment.ts
   - See FIREBASE_INIT_FIX_JAN2025.md for details

2. Routing Structure
   - Hash-based routing for Shopify compatibility
   - Lazy-loaded admin module
   - Quarter-specific game routes
   - See ROUTING_FIX_JAN2025.md for details

## Known Issues & Resolutions

### 1. Firebase Initialization (Jan 2025)
Resolved conflict between multiple initialization methods.
See: FIREBASE_INIT_FIX_JAN2025.md

### 2. Routing Issues (Jan 2025)
Fixed issues with routes redirecting to base URL.
See: ROUTING_FIX_JAN2025.md

## Project Structure Guidelines

### 1. Firebase Integration
```typescript
// Always use provider pattern in app.module.ts
@NgModule({
  imports: [
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    // other providers...
  ]
})
```

### 2. Route Organization
```typescript
// app-routing.module.ts
const routes: Routes = [
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module')
      .then(m => m.AdminModule)
  },
  // other routes...
];
```

## Key Architectural Decisions

### 1. Web Components
- Used for Shopify integration
- One component per quarter
- Embedded game functionality

### 2. Firebase Services
- Centralized initialization
- Proper error handling
- Consistent provider pattern

### 3. Routing Strategy
- Hash-based for Shopify
- Lazy loading for performance
- Protected admin routes

## Development Workflow

### 1. New Features
1. Create feature branch
2. Update documentation
3. Implement changes
4. Test thoroughly
5. Create PR

### 2. Bug Fixes
1. Document in relevant .md file
2. Implement fix
3. Add tests if needed
4. Update documentation

## Critical Files

### 1. Configuration
- environment.ts - Environment config
- firebase.json - Firebase config
- angular.json - Angular config

### 2. Core Functionality
- app.module.ts - Main app configuration
- app-routing.module.ts - Route configuration
- firebase.service.ts - Firebase operations

## Testing Guidelines

### 1. Firebase Features
- Test with emulators
- Verify error handling
- Check initialization

### 2. Routing
- Test deep linking
- Verify guards
- Check Shopify embedding

## Common Issues & Solutions

### 1. Route Redirection
If routes redirect to base URL:
- Check guard implementation
- Verify lazy loading
- Check Firebase initialization

### 2. Firebase Errors
For dependency injection errors:
- Verify provider pattern usage
- Check initialization order
- Look for duplicate providers

## Future Considerations

### 1. Performance
- Monitor Firebase usage
- Optimize lazy loading
- Cache where appropriate

### 2. Scalability
- Plan for more quarters
- Consider data archiving
- Monitor Firestore quotas

Maintained by: [Your Team]
Last Updated: January 2025