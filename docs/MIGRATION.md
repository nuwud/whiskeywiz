# WhiskeyWiz Database Migration Guide

## Overview
Migration from Firestore to Realtime Database for active game sessions, maintaining quarter-based structure.

## Migration Process

### Test Migration
```bash
# Run test migration
npm run migrate:test

# Options
--keep        # Keep test data
--production  # Run in production mode
```

### Monitoring
Access the migration dashboard at `/admin/migration`

### Validation Rules
1. Quarter integrity preserved
2. Game data complete
3. No duplicate migrations
4. Performance within thresholds

## Database Structure

### Firestore (Original)
```
/quarters/{quarterId}
/sessions/{sessionId}
/users/{userId}
```

### Realtime Database (New)
```
/games/{gameId}
  ├── quarterInfo/
  │   ├── id
  │   ├── startDate
  │   └── endDate
  ├── players/
  ├── status
  └── lastUpdate
```

## Performance Metrics
- Target migration time: <500ms per game
- Concurrent operations: 10 max
- Batch size: 50 games

## Rollback Procedure
1. Access migration dashboard
2. Click "Rollback Migration"
3. Confirm action
4. Monitor rollback progress

## Monitoring Tools
- Real-time progress tracking
- Error logging
- Performance metrics
- Validation reports

## Security Considerations
- Only admin access
- Data validation
- Atomic operations
- Backup procedures

## Testing
```typescript
// Run migration tests
npm run test:migration

// Validate migration
npm run validate:migration
```

## Troubleshooting
1. Check migration logs
2. Verify Firebase quotas
3. Monitor error reports
4. Check network connectivity