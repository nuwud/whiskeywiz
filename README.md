# Whiskey Wiz Game

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
- Custom web components for Shopify
- Firebase Authentication
- Firebase Analytics

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

## 🎯 Important Notes for Claude
1. Check `/docs/FOR_CLAUDE.md` first - Contains essential setup and MCP usage instructions
2. Implementation notes in `/docs/IMPLEMENTATION_NOTES.md` track all changes
3. Use quarters/1225 as reference for component implementation
4. All quarters follow standard template pattern

## 🔑 Key Components
1. BaseQuarterComponent: Base class for all quarters
2. QuarterComponent: Router component for dynamic loading
3. GameBanner: Main game interface component
4. AdminComponent: Quarter management interface

## 📝 Component Template
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

## 🔄 Recent Updates
- Standardized all quarter components
- Removed direct FIREBASE_APP injection
- Updated module architecture
- Enhanced analytics tracking

## 🚀 Development Workflow
1. Check FOR_CLAUDE.md for setup
2. Follow implementation notes for context
3. Use standard quarter template
4. Update documentation

## 📚 Documentation Index
1. /docs/FOR_CLAUDE.md - Essential setup instructions
2. /docs/IMPLEMENTATION_NOTES.md - Change history
3. README.md - Project overview

## 🔍 Common Tasks
1. Adding new quarters: Follow quarter template in quarters/
2. Component updates: Check implementation notes
3. Working with files: Use window.fs.readFile in components
4. Firebase operations: Use service methods

## 🤝 Contributing
Please update implementation notes when making changes.

## 📌 Important Files
- src/app/quarters/base-quarter.component.ts
- src/app/shared/shared.module.ts
- src/app/quarters/quarters.module.ts
- docs/FOR_CLAUDE.md