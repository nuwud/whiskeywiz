# WhiskeyWiz Game

## 🎮 Project Overview
A web-based whiskey tasting game that allows players to guess attributes of whiskey samples and compete quarterly. Built with Angular and Firebase, designed to be embedded in Shopify pages.

## 📋 Key Features
- Quarterly whiskey tasting challenges
- Guest and authenticated play modes
- Score tracking and leaderboards
- Analytics and user tracking
- Shopify integration via web components

## 🛠 Technical Stack
- Angular 17.2
- Firebase/Firestore
- Nx Workspace
- Firebase Emulators
- GitHub Actions CI/CD
- Docker Development Environment

## 🚀 Quick Start

### Development with Docker
```bash
# Start the development environment
docker-compose up

# Access the application
http://localhost:4200

# Access Firebase Emulator UI
http://localhost:4000
```

### Local Development
```bash
# Install dependencies
npm install

# Start the application
npx nx serve whiskey-wiz

# Run Firebase emulators
firebase emulators:start
```

## 🗂 Project Structure
```
src/
├── app/
│   ├── shared/           # Shared components and models
│   ├── quarters/         # Quarterly game components
│   ├── services/         # Firebase and game services
│   ├── admin/           # Admin interface
│   └── elements/        # Web component wrappers
└── assets/
    └── images/          # UI elements and assets
```

## 🔑 Core Components
1. BaseQuarterComponent: Base class for all quarters
2. QuarterComponent: Router component for dynamic loading
3. GameBanner: Main game interface component
4. AdminComponent: Quarter management interface

## 📝 Quarter Template
```typescript
export class Q[MMYY]Component extends BaseQuarterComponent {
  @Input() override quarterId: string = '[MMYY]';
  @Input() override quarterName: string = '[Month YYYY]';

  constructor(
    firebaseService: FirebaseService,
    authService: AuthService,
    analyticsService: AnalyticsService
  ) {
    super(firebaseService, authService, analyticsService);
  }
}
```

## 🔧 Environment Setup
1. Firebase Configuration:
   - Authentication
   - Firestore
   - Storage
   - Hosting
   - Analytics
   - Emulators

2. Development Tools:
   - VSCode with recommended extensions
   - Docker and Docker Compose
   - Firebase CLI
   - Node.js 20.x

## 📦 Deployment
Automated deployments via GitHub Actions:
- Push to main: Deploys to production
- Pull Requests: Creates preview deployments

## 🧪 Testing
```bash
# Run unit tests
npx nx test whiskey-wiz

# Run e2e tests
npx nx e2e whiskey-wiz-e2e
```

## 🤝 Contributing
1. Create a feature branch from main
2. Follow the standard quarter template for new quarters
3. Update documentation
4. Create a pull request

## 📚 Documentation
- /docs/IMPLEMENTATION_NOTES.md - Change history
- /docs/ARCHITECTURE.md - System design
- /docs/DEPLOYMENT.md - Deployment guide

## ⚠️ Important Notes
- Always use Firebase Services through service wrappers
- Follow quarter naming convention (MMYY)
- Use emulators for local development
- Keep documentation updated

## 🔐 Security
- Authentication required for admin features
- Firestore rules enforce access control
- Storage rules limit file types and sizes
- Environment variables managed via GitHub Secrets

## 📈 Monitoring
- Firebase Analytics integration
- Error tracking
- User behavior analysis
- Performance monitoring

## 🌟 Latest Updates
- Optimized Docker configuration
- Enhanced GitHub Actions workflow
- Added Firebase emulators
- Improved development experience

## 📞 Support
For issues and feature requests, please use the GitHub issue tracker.