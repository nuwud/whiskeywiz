# WhiskeyWiz React Essential Guide for Claude
Version: January 2025
Last Updated: January 8, 2025

## STOP AND READ THIS FIRST
1. This is a React port of the WhiskeyWiz Angular application
2. Core game mechanics remain identical:
   - 4 samples per quarter (A, B, C, D)
   - Quarter naming: MMYY format
   - Same scoring rules and validation
3. Uses React patterns instead of Angular services

## CORE PROJECT STRUCTURE
```
src/
├── components/           # React components
│   ├── admin/           # Admin interface
│   ├── game/            # Game components
│   ├── common/          # Shared components
│   └── results/         # Results display
├── contexts/            # React contexts
├── hooks/               # Custom hooks
├── services/           # Core services
├── models/             # TypeScript types
└── utils/              # Utility functions
```

## CRITICAL INTERFACES - IDENTICAL TO ANGULAR
```typescript
interface Quarter {
  id: string;          // MMYY format
  name: string;        // "Q1 2024" format
  active: boolean;
  samples: {
    [key in 'A' | 'B' | 'C' | 'D']: Sample;
  };
}

interface Sample {
  id: string;
  age: number;         // Years
  proof: number;       // 80-160 range
  mashbill: MashbillType;
}

type MashbillType = 'Bourbon' | 'Rye' | 'Wheat' | 'Single Malt' | 'Specialty';

interface GameState {
  currentSample: 'A' | 'B' | 'C' | 'D';
  guesses: {
    [key in 'A' | 'B' | 'C' | 'D']?: {
      age: number;
      proof: number;
      mashbill: MashbillType;
    };
  };
  isComplete: boolean;
  quarterId: string;
  totalScore?: number;
}
```

## REQUIRED PATTERNS

### 1. Service Pattern
```typescript
// Singleton service pattern
class ExampleService {
  private static instance: ExampleService;
  
  private constructor() {}
  
  static getInstance() {
    if (!ExampleService.instance) {
      ExampleService.instance = new ExampleService();
    }
    return ExampleService.instance;
  }
}

export const exampleService = ExampleService.getInstance();
```

### 2. Context Pattern
```typescript
// Context with Provider pattern
export const GameContext = createContext<GameContextType | null>(null);

export const GameProvider: React.FC = ({ children }) => {
  // State management here
  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGame must be used within GameProvider');
  return context;
};
```

### 3. Firebase Access Pattern
```typescript
// Always use service layer
export const firebaseService = {
  async getQuarter(id: string) {
    const docRef = doc(db, 'quarters', id);
    const docSnap = await getDoc(docRef);
    return docSnap.data() as Quarter;
  }
};
```

## SCORING RULES - IDENTICAL TO ANGULAR
```typescript
const SCORING_RULES = {
  age: {
    exactMatch: 30,
    perYearOff: -4
  },
  proof: {
    exactMatch: 30,
    perProofOff: -2
  },
  mashbill: {
    correctType: 10
  }
};
```

## COMMON MISTAKES TO AVOID
1. DON'T use Angular patterns in React
2. DON'T modify scoring rules
3. DON'T use direct Firebase access
4. DON'T skip context providers
5. DON'T modify core interfaces
6. DON'T skip error boundaries

## PRE-IMPLEMENTATION CHECKLIST
Before making any changes:

### 1. Pattern Verification
- [ ] Uses React patterns (not Angular)
- [ ] Follows service singleton pattern
- [ ] Uses context providers appropriately
- [ ] Implements error boundaries

### 2. Type Safety
- [ ] Core interfaces match Angular
- [ ] Props are properly typed
- [ ] Context types are defined
- [ ] Services follow type patterns

### 3. Feature Parity
- [ ] All Angular features implemented
- [ ] Same validation rules applied
- [ ] Same scoring system used
- [ ] Same offline capabilities

Remember: The goal is feature parity with the Angular version while using proper React patterns.