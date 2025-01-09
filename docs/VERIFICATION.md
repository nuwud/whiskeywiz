# WhiskeyWiz Email Verification System

## Overview
The WhiskeyWiz email verification system uses Firebase Authentication with custom email templates and handlers.

## Components

### Email Templates
- Verification Email
- Welcome Email
- Password Reset Email

### Authentication Flow
1. User signs up
2. Verification email sent
3. User clicks verification link
4. Success page shown
5. Welcome email sent
6. User redirected to dashboard

### Rate Limiting
- Max 5 verification attempts per 24 hours
- 5-minute cooldown between resend attempts

## Cloud Functions
Located in `/functions/src/email/`:
- `sendEmail` - Generic email sending function
- `onEmailVerified` - Handles post-verification tasks
- `trackVerificationAttempts` - Manages rate limiting

## Testing
- Automated email template testing
- Verification flow integration tests
- Rate limiting tests

## Security
- Firebase Authentication integration
- Custom security rules
- Rate limiting
- Email domain validation

## Components Structure
```
src/
├── components/
│   └── auth/
│       ├── VerifyEmail.tsx
│       └── VerifySuccess.tsx
├── services/
│   ├── emailTemplates.ts
│   └── emailVerificationService.ts
└── contexts/
    └── AuthContext.tsx
```

## Usage Example
```typescript
import { emailVerificationService } from '../services/emailVerificationService';

// Send verification email
await emailVerificationService.sendVerificationEmail(user);

// Verify email
await emailVerificationService.verifyEmail(actionCode);
```

## Environment Variables
```env
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_domain
```

## Development Setup
1. Configure Firebase project
2. Set up email templates
3. Deploy Cloud Functions
4. Test verification flow