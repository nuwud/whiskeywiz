# Firebase Implementation - January 2025

## Overview
The WhiskeyWiz game uses Firebase for data storage, state management, and user authentication. This document outlines the implementation details and requirements.

## Data Structure

### Collections

1. `quarters/`
   ```typescript
   interface Quarter {
     id: string;           // MMYY format
     name: string;         // e.g., "March 2024"
     active: boolean;      // Availability status
     videoUrl?: string;    // Optional intro video
     samples: {            // Whiskey samples
       [key: string]: Sample;
     };
   }
   ```

2. `gameStates/`
   ```typescript
   interface GameState {
     id: string;          // Quarter ID (MMYY)
     playerId: string;    // Player identifier
     status: string;      // Game status
     guesses?: {          // Player guesses
       [key: string]: {
         age: number;
         proof: number;
         mashbill: string;
       };
     };
     updatedAt: timestamp; // Last update time
   }
   ```

3. `scores/`
   ```typescript
   interface PlayerScore {
     id?: string;         // Auto-generated
     playerId: string;    // Player identifier
     playerName: string;  // Display name
     score: number;       // Final score
     quarterId: string;   // MMYY format
     timestamp?: any;     // Submission time
     guesses?: {          // Final guesses
       [key: string]: {
         age: number;
         proof: number;
         mashbill: string;
         rating?: number;
       };
     };
   }
   ```

## Implementation Details

### 1. Service Initialization
```typescript
constructor(private firestore: Firestore, private router: Router) {
  this.scoringRulesRef = doc(this.firestore, 'config/scoringRules');
  this.scoresRef = collection(this.firestore, 'scores');
  this.quartersRef = collection(this.firestore, 'quarters');
  this.gameStatesRef = collection(this.firestore, 'gameStates');
}
```

### 2. Quarter Management
```typescript
// Get all quarters
getQuarters(): Observable<Quarter[]>

// Get specific quarter
getQuarterById(mmyy: string): Observable<Quarter | null>

// Save quarter data
saveQuarter(quarter: Quarter): Promise<void>
```

### 3. Game State Management
```typescript
// Save game progress
saveGameProgress(playerId: string, state: GameState): Observable<void>

// Get player's game state
getPlayerGameState(playerId: string, quarterId: string): Observable<GameState | null>
```

### 4. Score Management
```typescript
// Save player score
saveScore(score: PlayerScore): Observable<void>

// Get quarter scores
getQuarterScores(quarterId: string): Observable<PlayerScore[]>
```

## Security Rules

### 1. Quarters Collection
```javascript
match /quarters/{mmyy} {
  allow read: if true;
  allow write: if request.auth != null && request.auth.token.admin == true;
}
```

### 2. Game States Collection
```javascript
match /gameStates/{stateId} {
  allow read: if request.auth != null && 
    request.auth.uid == resource.data.playerId;
  allow write: if request.auth != null && 
    request.auth.uid == request.resource.data.playerId;
}
```

### 3. Scores Collection
```javascript
match /scores/{scoreId} {
  allow read: if true;
  allow write: if request.auth != null && 
    request.auth.uid == request.resource.data.playerId;
}
```

## Testing Requirements

### 1. Service Tests
- Initialize service
- MMYY validation
- Quarter CRUD operations
- Game state management
- Score submission

### 2. Integration Tests
- Quarter loading in components
- Game state persistence
- Score submission flow
- Error handling

### 3. Security Rule Tests
- Quarter access control
- Game state privacy
- Score submission validation

## Error Handling

### 1. Initialization
```typescript
try {
  // Initialize service
  this.initialized = true;
} catch (error) {
  console.error('Failed to initialize:', error);
  this.router.navigate(['/']);
}
```

### 2. Operation Checks
```typescript
private ensureInitialized() {
  if (!this.initialized) {
    throw new Error('Firebase service not properly initialized');
  }
}
```

### 3. Data Validation
```typescript
private validateQuarter(quarter: Quarter | null): Quarter | null {
  if (!quarter || !this.isValidMMYY(quarter.id)) {
    console.warn('Invalid quarter:', quarter);
    return null;
  }
  return quarter;
}
```

## Deployment Checklist

### 1. Configuration
- [ ] Firebase project setup
- [ ] Security rules deployment
- [ ] Indexes creation

### 2. Testing
- [ ] Service unit tests
- [ ] Integration tests
- [ ] Security rules tests

### 3. Monitoring
- [ ] Error logging setup
- [ ] Performance monitoring
- [ ] Usage analytics

Last Updated: January 2025