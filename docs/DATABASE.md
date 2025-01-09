# WhiskeyWiz Database Architecture

## Overview
WhiskeyWiz uses a hybrid database approach:
- Firestore for persistent data
- Realtime Database for active game sessions
- Local storage for user preferences
- Service workers for offline support

## Data Structure

### Firestore Collections

#### Users Collection
```typescript
interface User {
  uid: string;
  email: string;
  displayName?: string;
  isAdmin: boolean;
  createdAt: Timestamp;
  lastLogin: Timestamp;
  preferences: {
    theme: 'light' | 'dark';
    notifications: boolean;
    language: string;
  };
}
```

#### Game History Collection
```typescript
interface GameHistory {
  gameId: string;
  userId: string;
  timestamp: Timestamp;
  score: number;
  whiskeyIds: string[];
  answers: Answer[];
  totalTime: number;
}
```

### Realtime Database Structure

#### Active Games
```typescript
interface ActiveGame {
  /games/{gameId}: {
    status: 'active' | 'paused' | 'completed';
    players: {
      [userId: string]: {
        status: 'ready' | 'playing' | 'finished';
        currentQuestion: number;
        score: number;
        lastActive: number;
      }
    };
    currentRound: number;
    startedAt: number;
    settings: GameSettings;
  }
}
```

## Security Rules

### Firestore Rules
Important security considerations:
1. User data is only accessible by the user themselves
2. Admin access is restricted to verified admin accounts
3. Game data is read-only after completion
4. Analytics data is admin-only

### Realtime Database Rules
Focus on:
1. Active game session security
2. Player verification
3. Rate limiting
4. Data validation

## Optimization Strategies

### Caching
1. Static Data
   - Whiskey information
   - Game configurations
   - User preferences

2. Dynamic Data
   - Active game state
   - User progress
   - Leaderboards

### Indexing
Important indexes:
1. User scores for leaderboards
2. Game history by user
3. Active games by status

### Cost Optimization
Strategies to minimize database costs:
1. Batch operations
2. Efficient queries
3. Data pagination
4. Cache utilization

## Migration Guides

### From Firestore to Realtime Database
Steps for migrating active game sessions:
1. Data backup
2. Schema translation
3. Gradual migration
4. Validation and testing

## Monitoring

### Performance Metrics
Key metrics to monitor:
1. Query response times
2. Write operation latency
3. Cache hit rates
4. Error rates

### Cost Metrics
Track:
1. Document reads/writes
2. Bandwidth usage
3. Storage utilization

## Best Practices

### Data Access
1. Use batch operations
2. Implement pagination
3. Cache frequently accessed data
4. Use compound queries efficiently

### Security
1. Validate all user input
2. Implement rate limiting
3. Use security rules effectively
4. Regular security audits

## Maintenance

### Regular Tasks
1. Index optimization
2. Cache invalidation
3. Data archival
4. Performance monitoring

### Backup Strategy
1. Daily automated backups
2. Manual backups before major changes
3. Backup verification procedures
4. Restoration testing

## Testing

### Test Environment
1. Use Firebase Emulator
2. Implement integration tests
3. Load testing procedures
4. Security rule tests