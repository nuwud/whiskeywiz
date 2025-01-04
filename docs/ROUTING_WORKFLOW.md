# Whiskey Wiz Routing & Navigation Guide

## Current Implementation (January 2025)

### 1. Application Structure
- Uses hash-based routing for Shopify compatibility
- Lazy loaded admin module
- Protected routes with auth guards
- Quarterly game component system

### 2. Route Hierarchy
```
/#/admin                -> Lazy loads AdminModule
  ├── /quarters         -> Default view (Quarter management)
  └── /analytics        -> Analytics dashboard
/#/game                 -> Main game component
  └── ?quarter=Q12024   -> Quarter-specific game
/#/player              -> Player dashboard
/#/login               -> Authentication
/#/register            -> New user registration
```

### 3. Key Components & Their Roles

#### Admin Module
- **Location**: src/app/admin/
- **Lazy Loading**: Improves initial load time
- **Protected**: Uses canActivateAdmin guard
- **Features**: Quarter management, analytics

#### Game Component
- **Location**: src/app/shared/game/
- **Access**: Protected by canActivateGame guard
- **Quarter Handling**: Uses query parameters
- **State Management**: Manages game progress

### 4. Authentication Flow
```typescript
// Example guard usage in app-routing.module.ts
{
  path: 'admin',
  loadChildren: () => import('./admin/admin.module')
    .then(m => m.AdminModule),
  canActivate: [canActivateAdmin]
}
```

### 5. Navigation Methods

#### Admin Navigation
Use Router.navigate with proper hash routing:
```typescript
// Correct
router.navigate(['/admin/quarters'])

// Incorrect - don't manually add hash
router.navigate(['/#/admin'])
```

#### Game Navigation
Use query parameters for quarters:
```typescript
// Navigate to specific quarter
router.navigate(['/game'], { 
  queryParams: { quarter: 'Q12024' }
})
```

### 6. Common Issues & Solutions

1. **NullInjectorError**
   - Cause: Missing providers in feature modules
   - Solution: Add required services to module providers

2. **Routing to Base URL**
   - Cause: Incorrect navigation syntax
   - Solution: Use Router.navigate without manual hash

3. **Auth Guard Issues**
   - Cause: Duplicate guards or incorrect placement
   - Solution: Place guards only in app-routing.module.ts

### 7. Development Guidelines

1. **Adding New Routes**
   ```typescript
   // In feature module routing
   const routes: Routes = [
     {
       path: '',
       component: FeatureComponent,
       children: [...]
     }
   ];
   ```

2. **Authentication**
   - Always use guards from app-routing.module.ts
   - Avoid duplicate guard declarations
   - Test both authenticated and guest flows

3. **Quarter Management**
   - Use query parameters for quarter selection
   - Maintain quarter state in game service
   - Handle invalid quarter IDs gracefully

### 8. Testing Routes

1. **Admin Routes**
   - /#/admin -> Should lazy load admin module
   - /#/admin/quarters -> Default view
   - /#/admin/analytics -> Analytics view

2. **Game Routes**
   - /#/game -> Base game view
   - /#/game?quarter=Q12024 -> Specific quarter

3. **Auth Routes**
   - /#/login -> Login form
   - /#/register -> Registration form

### 9. Future Improvements

1. **Planned Enhancements**
   - Deep linking support for sharing
   - Better error handling for invalid routes
   - Enhanced route transitions

2. **Known Limitations**
   - Hash routing required for Shopify
   - Quarter parameters in URL may need revision

### 10. Quick Reference

```bash
# Common URLs
/#/admin                    # Admin dashboard
/#/admin/quarters          # Quarter management
/#/admin/analytics         # Analytics view
/#/game?quarter=Q12024     # Specific quarter game
/#/login                   # Authentication
```

Maintained by: [Your Team]
Last Updated: January 2025