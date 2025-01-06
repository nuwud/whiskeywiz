# Services Implementation Checklist

## Core Services
- [x] AuthService - Updated with persistence and token refresh
- [x] GameService - Verified
- [x] ScoreService - Verified
- [x] ValidationService - Implemented with MMYY format

## Data Layer
- [ ] FirebaseService - Needs offline support
- [x] OfflineQueueService - New implementation complete
- [ ] DataCollectionService - Missing error handling
- [x] QuarterPopulationService - Verified

## Feature Services
- [ ] AnalyticsService - Needs error tracking
- [x] ScoreSharingService - Verified
- [x] GameStateService - Updated
- [ ] ShopifyService - Needs error handling

## Support Services
- [x] HermonaFontService
- [x] VersionService

## Required Updates

### FirebaseService
```typescript
// Add offline support
private handleOfflineOperation(operation: () => Promise<any>): Promise<any> {
  try {
    return operation();
  } catch (error) {
    if (this.isOfflineError(error)) {
      return this.offlineQueue.enqueue(operation);
    }
    throw error;
  }
}
```

### DataCollectionService
```typescript
// Add error handling
private handleError(error: any, operation: string) {
  console.error(`${operation} failed:`, error);
  this.analytics.logError(operation, error);
  return throwError(() => error);
}
```

### AnalyticsService
```typescript
// Add error tracking
trackError(context: string, error: any) {
  this.analytics.logEvent('error', {
    context,
    message: error.message,
    code: error.code
  });
}
```

### ShopifyService
```typescript
// Add error handling
private handleShopifyError(error: any) {
  if (error.status === 429) {
    return this.handleRateLimit(error);
  }
  return throwError(() => this.normalizeError(error));
}
```

## Implementation Notes
1. All services must:
   - Handle offline scenarios
   - Include error tracking
   - Support typescript strict mode
   - Follow Angular DI patterns

2. Testing Requirements:
   - Unit tests for critical paths
   - Error handling coverage
   - Offline behavior verification

FOR_CLAUDE: Implement missing pieces in order of priority:
1. FirebaseService offline support
2. Analytics error tracking
3. Data collection error handling
4. Shopify error handling