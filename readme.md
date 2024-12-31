# Whiskey Wiz

Blind Barrels' Whiskey Blind Tasting Game - A quarterly interactive whiskey tasting experience built with Angular and Firebase.

## Overview

Whiskey Wiz is a gamified whiskey tasting application that integrates with Shopify pages via web components. Players guess attributes of quarterly whiskey samples, earning points and sharing their results.

## Project Structure

This project uses Nx for monorepo management and Angular 17.2 with Firebase backend.

```markdown
src/
├── app/
│   ├── admin/             # Admin feature module (lazy loaded)
│   ├── player/            # Player feature module (lazy loaded)
│   ├── admin-nav/         # Admin navigation module
│   ├── auth/              # Authentication components
│   ├── core/              # Core module (services)
│   ├── shared/            # Shared components and models
│   │   ├── components/
│   │   ├── game/         # Main game components
│   │   ├── models/       # Interfaces and types
│   │   └── results/      # Score display components
│   └── quarters/         # Quarter-specific components
├── assets/
│   ├── fonts/           # Hermona font files
│   └── images/          # UI assets
└── environments/        # Environment configurations
```

## Key Features

- Quarterly whiskey tasting games
- Web component integration for Shopify
- Firebase backend with real-time updates
- Guest and authenticated play modes
- Admin interface for quarter management
- Advanced analytics tracking

## Analytics Implementation

The application tracks:

- Player location data
- Device and platform information
- Sample ratings and preferences
- Game completion metrics
- Shopify customer correlation
- Score distribution
- Time-based engagement metrics

Analytics are collected via:

- Firebase Analytics
- Custom tracking service
- Shopify customer events

## Development Setup

1. Install dependencies:

```bash
npm install
```

2. Serve the application:

```bash
nx serve whiskeywiz
```

3. Build web components:

```bash
npm run build:elements
```

## Deployment

The application is deployed to Firebase Hosting at whiskeywiz2.web.app.

```bash
npm run deploy
```

## Shopify Integration

Embed game components in Shopify pages using:

```html
<whiskey-wiz-{quarterId}></whiskey-wiz-{quarterId}>
```

## Environment Setup

Requires environment.ts with Firebase configuration:

```typescript
export const environment = {
  production: false,
  firebase: {
    // Firebase config
  }
};
```

## Contributing

See CONTRIBUTING.md for development guidelines and procedures.

## Testing

Run tests:

```bash
nx test
nx e2e
```

## License

Proprietary - Blind Barrels © 2024
