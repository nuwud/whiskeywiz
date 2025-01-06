# Authentication Fixes - January 2025

## Issues Found
1. Missing token refresh handling
2. No persistence configuration
3. Race condition in user roles
4. Incorrect guest session handling
5. Missing auth state recovery

## Implementation

### 1. Auth Service Update
```typescript
import { Auth, setPersistence, browserLocalPersistence } from '@angular/fire/auth';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private auth: Auth) {
    setPersistence(auth, browserLocalPersistence);
    this.setupTokenRefresh();
  }

  private setupTokenRefresh() {
    this.user$.pipe(
      switchMap(user => {
        if (!user) return of(null);
        return interval(10 * 60 * 1000).pipe( // Check every 10 min
          startWith(0),
          switchMap(() => from(user.getIdToken()))
        );
      })
    ).subscribe();
  }
}
```

### 2. Role Loading Fix
```typescript
private loadUserRoles(user: User) {
  return from(getDoc(doc(this.firestore, `users/${user.uid}`))).pipe(
    map(doc => doc.data() as UserData),
    map(userData => ({
      isAdmin: userData?.isAdmin || this.adminEmails.includes(user.email || ''),
      isGuest: false
    })),
    catchError(() => of({ isAdmin: false, isGuest: false }))
  );
}
```

### 3. Guest Session Update
```typescript
interface GuestSession {
  id: string;
  created: number;
  expires: number;
}

private handleGuestSession(): Observable<string> {
  return defer(() => {
    const session = this.getStoredGuestSession();
    if (session && session.expires > Date.now()) {
      return of(session.id);
    }
    return this.createNewGuestSession();
  });
}
```

### 4. Auth State Recovery
```typescript
private initializeAuthState() {
  const storedAuth = localStorage.getItem('authState');
  if (storedAuth) {
    const { isAdmin, isGuest } = JSON.parse(storedAuth);
    this.userRoles.next({ isAdmin, isGuest });
  }
}
```

## Deployment Steps
1. Clear browser storage on deploy
2. Verify environment variables
3. Test all auth flows
4. Monitor token refresh
5. Check guest transitions

## Testing Requirements
1. Guest session expiry
2. Token refresh behavior
3. Role persistence
4. Error recovery
5. Network interruptions

FOR_CLAUDE: Comprehensive auth fixes to prevent navigation issues