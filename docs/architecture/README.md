# WhiskeyWiz Architecture

## Project Structure
```
src/
├── app/
│   ├── shared/           # Shared components & models
│   ├── quarters/         # Quarter components
│   ├── services/         # Firebase services
│   ├── admin/           # Admin interface
│   └── elements/        # Web components
└── assets/              # Static assets
```

## Core Components
1. BaseQuarterComponent
   - Base class for all quarters
   - Handles core game logic
   - Manages Firebase interactions

2. GameComponent 
   - Main game interface
   - State management
   - Score calculation

3. AdminComponent
   - Quarter management
   - Sample configuration
   - Analytics dashboard

## Database Schema
```typescript
interface Quarter {
  id: string;          // MMYY format
  name: string;        // Display name
  active: boolean;     // Current status
  samples: {
    sample1: Sample;   // Always 4 samples
    sample2: Sample;
    sample3: Sample;
    sample4: Sample;
  };
}

interface Sample {
  age: number;
  proof: number;
  mashbill: MashbillType;
  shopifyProduct?: ShopifyProduct;
}

interface PlayerScore {
  score: number;
  timestamp: number;
  playerId?: string;
  quarterId: string;
  guesses: Record<SampleLetter, Sample>;
}
```

## Security Model
- Authentication required for admin
- Firestore rules enforce access
- Storage rules limit file types
- Environment variables in GitHub Secrets

## Integration Points
1. Firebase
   - Authentication
   - Firestore DB
   - Cloud Storage
   - Analytics

2. Shopify
   - Web Component embedding
   - Product integration
   - Cart management

## Detailed Guides
- [Component Architecture](components.md)
- [Database Design](database.md)
- [Security Configuration](security.md)