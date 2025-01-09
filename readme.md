# WhiskeyWiz 🥃

## Overview
WhiskeyWiz is a quarterly whiskey tasting game where players guess attributes of whiskey samples. Built with Angular and Firebase, designed to embed in Shopify storefronts.

## Quick Start

### Development
```bash
# Start with Docker (recommended)
docker-compose up

# Or manually
npm install
npx nx serve whiskey-wiz
```

Access:
- App: http://localhost:4200
- Firebase Emulators: http://localhost:4000

## Documentation
- [Architecture Guide](docs/architecture/README.md)
- [Development Guide](docs/development/README.md)
- [Deployment Guide](docs/deployment/README.md)

## Core Features
- Quarterly tasting challenges
- Guest & authenticated play
- Score tracking & leaderboards
- Analytics & user tracking
- Shopify integration

## Tech Stack
- Angular 17.2
- Firebase/Firestore
- Nx Workspace
- Docker
- GitHub Actions