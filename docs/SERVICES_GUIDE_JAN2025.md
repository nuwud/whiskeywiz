# WhiskeyWiz Services Guide

## Core Services Overview

### AuthService
```typescript
// Path: src/app/services/auth.service.ts
// Purpose: Authentication and authorization management
interface AuthOperations {
  signIn(email: string, password: string): Promise<User>;
  isAdmin(): Observable<boolean>;
  getPlayerId(): Observable<string>;
}
```
Key Features:
- Firebase authentication with local persistence
- Guest session management with 24-hour expiry
- Admin role verification
- Token refresh handling

### GameService
```typescript
// Path: src/app/services/game.service.ts
// Purpose: Game mechanics and state management
interface GameOperations {
  loadQuarter(mmyy: string): Promise<Quarter>;
  submitGuess(guess: GameGuess): void;
  calculateScore(guesses: GameGuess[]): Promise<Score>;
}
```
Key Features:
- Quarter loading and validation
- Score calculation and submission
- Game state persistence
- Offline play support

### ScoreService
```typescript
// Path: src/app/services/score.service.ts
// Purpose: Score calculations and rules
interface ScoringOperations {
  calculateSampleScore(guess: GameGuess, actual: Sample): number;
  getScoreQuip(score: number): string;
  generateShareText(score: number): string;
}
```
Features:
- Configurable scoring rules
- Share text generation
- Performance metrics

### FirebaseService
```typescript
// Path: src/app/services/firebase.service.ts
// Purpose: Database operations
interface FirebaseOperations {
  getQuarters(): Observable<Quarter[]>;
  submitScore(quarterId: string, score: number): Promise<void>;
  getUserScores(uid: string): Observable<Score[]>;
}
```
Features:
- CRUD operations for game data
- Real-time updates
- Batch operations support
- Error handling with retry

### OfflineQueueService
```typescript
// Path: src/app/services/offline-queue.service.ts
// Purpose: Offline functionality
interface QueueOperations {
  enqueueScore(quarterId: string, score: number): Promise<void>;
  processQueue(): Promise<void>;
}
```
Features:
- Offline data queuing
- Automatic retry on reconnect
- Queue persistence
- Progress tracking

### ValidationService
```typescript
// Path: src/app/services/validation.service.ts
// Purpose: Data validation
interface ValidationOperations {
  validateQuarter(quarterId: string): ValidationResult;
  validateScore(score: number): ValidationResult;
  formatQuarter(mmyy: string): string;
}
```
Features:
- MMYY format validation
- Score range checks
- Error message generation

## Integration Flow
1. User Authentication:
   ```mermaid
   graph LR
       Auth[AuthService] --> Firebase[FirebaseService]
       Auth --> Validate[ValidationService]
       Firebase --> Queue[OfflineQueue]
   ```

2. Game Flow:
   ```mermaid
   graph LR
       Game[GameService] --> Score[ScoreService]
       Score --> Firebase[FirebaseService]
       Game --> Queue[OfflineQueue]
   ```

## Error Handling Strategy
```typescript
// Standard error handling pattern
try {
  // Operation
} catch (error: any) {
  if (error.code === 'permission-denied') {
    handleAuthError(error);
  } else if (error.code === 'network-error') {
    queueOperation(error);
  }
  throw this.normalizeError(error);
}
```

## Testing Guidelines
```typescript
describe('ServiceName', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: FirebaseService, useValue: mockFirebaseService },
        { provide: AuthService, useValue: mockAuthService }
      ]
    });
  });
});
```

## FOR_CLAUDE
Remember:
- Services follow singleton pattern
- Guards prevent unauthorized access
- OfflineQueue handles network issues
- Each service has dedicated error handling

## Service Health Checks
1. Auth: Token refresh, role sync
2. Firebase: Connection state
3. Game: State persistence
4. Score: Rule consistency

## Configuration
- Environment variables in src/environments
- Firebase config in firebase.json
- Game rules in firestore.rules