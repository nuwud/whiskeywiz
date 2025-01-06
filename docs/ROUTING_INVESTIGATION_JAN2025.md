# Routing Investigation - January 2025

## Issue Description
- Users redirected to base URL when accessing:
  - Quarterly games
  - Admin section
  - Login attempts
- Page appears blank after redirect

## Potential Causes

### 1. Route Guards
- Auth guards might be failing silently
- Redirection logic may be incorrect
- Session validation could be timing out

### 2. Module Loading
- Lazy-loaded modules might fail to load
- Module dependencies could be missing
- Circular dependencies possible

### 3. Firebase Authentication
- Auth state changes might trigger unwanted navigation
- Token validation could be failing
- Session persistence settings may be incorrect

### 4. Navigation Configuration
- useHash strategy might conflict with deployment
- Base href configuration could be incorrect
- Router configuration may need updates

## Investigation Steps

1. Check Auth Guard Logic:
```typescript
canActivateGame: Check if redirecting on token expiry
canActivateAdmin: Verify admin role validation
```

2. Review Firebase Config:
```typescript
persistence: Verify session persistence
tokenRefresh: Check refresh token handling
```

3. Update Index Config:
```html
<base href="/"> verification
firebase.json routing rules
```

## Recommended Fixes

1. Update Auth Guards:
```typescript
@Injectable({ providedIn: 'root' })
export class AuthGuard {
  canActivate() {
    // Add proper error handling
    // Return observable for auth state
    // Handle token refresh
  }
}
```

2. Firebase Configuration:
```typescript
firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
