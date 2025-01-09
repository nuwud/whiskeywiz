# WhiskeyWiz Developer Guide

## Project Setup Instructions

### Prerequisites
- Node.js (v18+)
- npm or yarn
- Firebase CLI
- GitHub Account

### Initial Setup Steps
1. Clone the repository
2. Install dependencies: `npm install`
3. Set up Firebase configuration
4. Configure GitHub secrets

## Authentication System

### Overview
The application uses Firebase Authentication with the following features:
- Email/Password authentication
- Google Sign-in
- Role-based access control (User/Admin)
- Protected routes
- User profile management

### Components
- `AuthContext` - Global authentication state
- `PrivateRoute` - Route protection component
- `Login` - User authentication
- `ForgotPassword` - Password reset
- `UserProfile` - Profile management
- `AdminDashboard` - Admin controls

### User Roles
1. Regular User
   - Can access game features
   - Can manage their profile
   - Can view their game history

2. Admin User
   - Full access to admin dashboard
   - Can manage users
   - Can view audit logs
   - Can configure game settings

### Implementation Details
```typescript
// Using Protected Routes
<PrivateRoute 
  element={<Component />} 
  adminOnly={false} 
/>

// Accessing Auth Context
const { currentUser, isAdmin } = useAuth();

// Checking Authentication
if (!currentUser) {
  return <Navigate to="/login" />;
}
```

## Firebase CLI Installation and Authentication

[Previous Firebase CLI content remains the same...]

## Development Workflow

### Component Structure
```
src/
├── components/
│   ├── auth/
│   │   ├── Login.tsx
│   │   ├── ForgotPassword.tsx
│   │   └── UserProfile.tsx
│   ├── admin/
│   │   └── AdminDashboard.tsx
│   ├── game/
│   │   └── GameContainer.tsx
│   └── PrivateRoute.tsx
├── contexts/
│   └── AuthContext.tsx
├── services/
│   ├── authService.ts
│   └── adminService.ts
└── App.tsx
```

### Starting the Development Server
```bash
npm start
```

### Building the Project
```bash
npm run build
```

### Testing Auth Components
1. Run the development server
2. Navigate to /login
3. Test with default dev credentials:
   - Email: test@example.com
   - Password: testpass123
4. Or use Google Sign-in

### Deployment
- Pushes to `main` branch trigger automatic deployment
- Check GitHub Actions for deployment status

## Admin Dashboard Features

### Audit Logging
The admin dashboard maintains logs of all administrative actions:
- User management
- Game configuration changes
- System settings modifications

### User Management
Admins can:
- View all users
- Modify user roles
- Disable/enable accounts
- Reset user passwords

### Game Management
Admins can:
- Configure game settings
- Monitor active games
- View game statistics

## Troubleshooting

### Common Issues
- Verify Firebase configuration
- Check GitHub Actions logs
- Ensure all secrets are correctly configured
- Verify admin permissions in Firebase Console

### Authentication Issues
1. Check Firebase Authentication console
2. Verify email verification status
3. Check user claims for admin role
4. Verify Firebase rules

## Contact and Support
- Project Maintainer: [Your Name]
- Contact: [Contact Information]

*Last Updated*: January 2025