# Deployment Checklist - January 2025

## Firebase Configuration

### Authentication
- [x] Email/Password authentication enabled
- [x] Authorized domains configured:
  - localhost
  - whiskeywiz2.firebaseapp.com
  - whiskeywiz2.web.app
- [ ] Consider additional auth methods:
  - [ ] Google Sign-In
  - [ ] Phone authentication

### Firestore Database
- [x] Basic collections setup
  - users/
  - quarters/
  - scores/
  - gameStates/
- [ ] Indexes for queries
  - [ ] scores by quarterId
  - [ ] quarters by active status
- [ ] Backup configuration

### Realtime Database
- [ ] Evaluate need for realtime features:
  - [ ] Live score updates
  - [ ] Player presence
  - [ ] Game state sync

### Firebase Functions (Potential Uses)
1. Score Calculation
   ```javascript
   exports.calculateScore = functions.https.onCall((data, context) => {
     // Secure score calculation
   });
   ```

2. Admin Operations
   ```javascript
   exports.manageQuarters = functions.https.onCall((data, context) => {
     // Quarter management logic
   });
   ```

3. Analytics Events
   ```javascript
   exports.trackGameCompletion = functions.firestore
     .document('scores/{scoreId}')
     .onCreate((snap, context) => {
       // Analytics tracking
     });
   ```

### Analytics Setup
- [ ] Configure event tracking:
  - Game starts
  - Completions
  - Score distributions
  - User engagement

### Security Rules

#### Firestore
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Quarters
    match /quarters/{mmyy} {
      allow read: if true;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
    }

    // User Profiles
    match /users/{userId} {
      allow read: if request.auth != null && 
        (request.auth.uid == userId || 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true);
      allow write: if request.auth != null && request.auth.uid == userId;
    }

    // Scores
    match /scores/{scoreId} {
      allow read: if true;
      allow create: if request.auth != null || request.resource.data.isGuest == true;
      allow update, delete: if request.auth != null && 
        (request.auth.uid == resource.data.userId || 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true);
    }

    // Game States
    match /gameStates/{stateId} {
      allow read, write: if request.auth != null && 
        (request.auth.uid == resource.data.userId || 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true);
    }
  }
}
```

### Hosting Configuration
- [ ] Update firebase.json:
  ```json
  {
    "hosting": {
      "public": "dist/whiskeywiz",
      "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
      "rewrites": [{
        "source": "**",
        "destination": "/index.html"
      }]
    }
  }
  ```

### Build & Deploy Steps
1. Environment Updates
   ```bash
   # Update environment.prod.ts
   export const environment = {
     production: true,
     firebase: {
       // Config from Firebase Console
     }
   };
   ```

2. Build Process
   ```bash
   # Clean build
   npm run clean
   
   # Production build
   ng build --configuration production
   ```

3. Deployment
   ```bash
   # Deploy to Firebase
   firebase deploy
   
   # Or deploy specific features
   firebase deploy --only hosting
   firebase deploy --only firestore:rules
   ```

### Post-Deployment Verification
1. Authentication
   - [ ] Test login flow
   - [ ] Verify admin access
   - [ ] Check guest access

2. Game Functionality
   - [ ] Test quarter navigation
   - [ ] Verify game state
   - [ ] Check scoring

3. Admin Features
   - [ ] Quarter management
   - [ ] User management
   - [ ] Analytics access

### Monitoring Setup
1. Error Tracking
   - [ ] Configure Firebase Crashlytics
   - [ ] Set up error alerts

2. Performance Monitoring
   - [ ] Page load times
   - [ ] Authentication speed
   - [ ] Database response times

3. Usage Analytics
   - [ ] User engagement metrics
   - [ ] Feature adoption rates
   - [ ] Error rates

Last Updated: January 2025