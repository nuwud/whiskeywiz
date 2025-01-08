# Whiskey Wiz Application Structure

## Overview
This document provides a comprehensive map of the WhiskeyWiz application structure. For detailed architecture decisions, see [ARCHITECTURE_JAN2025.md](ARCHITECTURE_JAN2025.md), and for service interactions, see [SERVICES_ARCHITECTURE_JAN2025.md](SERVICES_ARCHITECTURE_JAN2025.md).

## Project Root Structure
```
src/
├── app/                    # Main application code
├── assets/                 # Static assets
├── environments/           # Environment configurations
├── styles/                # Global styles
├── index.html             # Main HTML file
├── main.ts                # Main entry point
├── polyfills.ts           # Polyfills for browser support
└── version.ts             # Version information
```

## Core Application Structure (src/app/)
```
app/
├── admin/                  # Admin interface components
├── admin-nav/             # Admin navigation components
├── auth/                  # Authentication components
├── config/                # Application configuration
├── core/                  # Core application code
├── elements/              # Web components
├── guards/                # Route guards
├── player/                # Player-related components
├── quarters/              # Quarter-specific components
│   ├── base-quarter.component.ts
│   ├── quarter.component.ts
│   └── {MMYY}/           # Individual quarter components
├── resolvers/             # Route resolvers
├── services/              # Application services
├── shared/                # Shared components and models
├── app-routing.module.ts  # Main routing configuration
├── app.component.ts       # Root component
└── app.module.ts          # Root module
```

## Service Architecture
Services are organized into four main categories (see [SERVICES_ARCHITECTURE_JAN2025.md](SERVICES_ARCHITECTURE_JAN2025.md) for details):

### Core Services
```
services/
├── Authentication & Authorization
│   ├── auth.service.ts
│   ├── validation.service.ts
│   └── version.service.ts
├── Game Logic
│   ├── game.service.ts
│   ├── game-state.service.ts
│   └── score.service.ts
├── Data Management
│   ├── firebase.service.ts
│   ├── data-collection.service.ts
│   └── offline-queue.service.ts
└── Integration
    ├── analytics.service.ts
    └── shopify.service.ts
```

## Quarter Components
Each quarter is implemented as both a routable component and a web component:

```
quarters/
├── base-quarter.component.ts    # Base functionality
├── quarter.component.ts         # Router outlet component
└── {MMYY}/                     # e.g., 0324/
    └── {MMYY}.component.ts     # Quarter-specific logic
```

Access patterns:
- Direct: `/#/quarters/0324`
- Embedded: `<whiskey-wiz-0324></whiskey-wiz-0324>`

## Models (src/app/shared/models/)
```
models/
├── analytics.model.ts    # Analytics data structures
├── game.model.ts        # Game-related interfaces
├── quarter.model.ts     # Quarter data structures
└── scoring.model.ts     # Scoring system interfaces
```

## Key Features and Locations

### Game Components
- Main game logic: `src/app/shared/game/`
- Quarter components: `src/app/quarters/`
- Player interface: `src/app/player/`

### Admin Interface
- Admin dashboard: `src/app/admin/`
- Quarter management: `src/app/admin/quarters/`
- Analytics: `src/app/admin/analytics/`

### Authentication
- Auth components: `src/app/auth/`
- Guards: `src/app/guards/`
- Services: `src/app/services/auth.service.ts`

### Shopify Integration
- Web components: `src/app/elements/`
- Service: `src/app/services/shopify.service.ts`

## Documentation Directory Structure
```
docs/
├── APPLICATION_STRUCTURE.md     # This file
├── ARCHITECTURE_JAN2025.md     # Architecture decisions
├── SERVICES_ARCHITECTURE_JAN2025.md # Service details
└── Other implementation guides...
```

## Build System
The project uses Nx workspace with `project.json` instead of traditional `angular.json` for configuration. All build, serve, and test configurations are managed through the Nx workspace.

## Related Documentation
- [ARCHITECTURE_JAN2025.md](ARCHITECTURE_JAN2025.md) - Detailed architecture decisions
- [SERVICES_ARCHITECTURE_JAN2025.md](SERVICES_ARCHITECTURE_JAN2025.md) - Service interactions and dependencies
- [FIREBASE_IMPLEMENTATION_JAN2025.md](FIREBASE_IMPLEMENTATION_JAN2025.md) - Firebase integration details

Last Updated: January 8, 2025