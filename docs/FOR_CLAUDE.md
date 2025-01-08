# WhiskeyWiz Essential Guide for Claude
Version: January 2025
Last Updated: January 8, 2025

## STOP AND READ THIS FIRST
1. This is a whiskey tasting game with EXACTLY 4 samples per quarter
2. Quarters are ALWAYS named MMYY (e.g., 0324 = March 2024)
3. Each sample has age, proof, and mashbill guesses
4. The app embeds in Shopify via web components
5. NEVER make assumptions - ALWAYS verify first

## REQUIRED VERIFICATION WORKFLOW
ALWAYS follow these steps in order:

```typescript
// 1. CHECK if files exist
<function_calls>
<invoke name="list_directory">
<parameter name="path">src/app/path/to/check</parameter>
</invoke>

// 2. READ existing file content
<function_calls>
<invoke name="read_file">
<parameter name="path">src/app/file/to/read</parameter>
</invoke>

// 3. VERIFY types with analysis tool
<function_calls>
<invoke name="repl">
<parameter name="code">
// Type verification code
</parameter>
</invoke>
```

## CORE PROJECT FACTS - NEVER CHANGE THESE
1. Project Structure:
   - Uses Nx workspace (NOT regular Angular CLI)
   - Uses project.json (NOT angular.json)
   - Firebase backend (ONLY via FirebaseService)

2. Quarter Structure:
   - ALWAYS 4 samples: A, B, C, D
   - ID format: MMYY (e.g., 0324)
   - Web component format: whiskey-wiz-{MMYY}

3. Core Files That ALWAYS Exist:
```
src/app/
├── shared/models/
│   ├── quarter.model.ts     # Core interfaces
│   ├── game.model.ts        # Game state
│   └── scoring.model.ts     # Scoring rules
├── services/
│   ├── firebase.service.ts  # ALL Firebase ops
│   ├── game.service.ts      # Game logic
│   └── auth.service.ts      # Authentication
└── quarters/
    ├── base-quarter.component.ts
    └── {MMYY}/             # Quarter components
```

## CRITICAL INTERFACES - MEMORIZE THESE
```typescript
interface Quarter {
  id: string;          // MMYY format
  name: string;        // "Q1 2024" format
  active: boolean;
  samples: {
    sample1: Sample;   // ALWAYS 4 samples
    sample2: Sample;
    sample3: Sample;
    sample4: Sample;
  };
}

interface Sample {
  id: string;
  age: number;         // Years
  proof: number;       // 80-160 range
  mashbill: MashbillType;
}

type MashbillType = 'Bourbon' | 'Rye' | 'Wheat' | 'Single Malt' | 'Specialty';

interface SampleGuess {
  age: number;
  proof: number;
  mashbill: MashbillType;
}
```

## REQUIRED CODE PATTERNS - ALWAYS FOLLOW THESE

### 1. Quarter Components
```typescript
// ALWAYS extend BaseQuarterComponent
@Component({
  selector: 'app-quarter-0324',  // MMYY format
  template: '...'
})
export class Q0324Component extends BaseQuarterComponent {
  constructor(
    protected firebaseService: FirebaseService,
    protected gameService: GameService
  ) {
    super(firebaseService, gameService);
  }
}
```

### 2. Firebase Access
```typescript
// ALWAYS use FirebaseService
@Injectable()
export class SomeService {
  constructor(private firebaseService: FirebaseService) {}

  // CORRECT:
  async getQuarter(id: string) {
    return this.firebaseService.getQuarter(id);
  }

  // WRONG - NEVER DO THIS:
  // async wrongWay() {
  //   const db = getFirestore();
  // }
}
```

### 3. Web Components
```typescript
// ALWAYS use MMYY format
const element = createCustomElement(Q0324Component, { injector });
customElements.define('whiskey-wiz-0324', element);
```

## SCORING RULES - NEVER MODIFY
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

## VERIFICATION TOOLS

### 1. File System Tools - ALWAYS Use These
```typescript
// List directories
<function_calls>
<invoke name="list_directory">
<parameter name="path">path/to/check</parameter>
</invoke>

// Read files
<function_calls>
<invoke name="read_file">
<parameter name="path">file/to/read</parameter>
</invoke>

// Search files
<function_calls>
<invoke name="search_files">
<parameter name="path">src/app</parameter>
<parameter name="pattern">search-term</parameter>
</invoke>
```

### 2. Analysis Tool - ALWAYS Type Check
```typescript
<function_calls>
<invoke name="repl">
<parameter name="code">
// Add type verification code here
</parameter>
</invoke>
```

## COMMON CLAUDE MISTAKES TO AVOID
1. DON'T skip file verification
2. DON'T use direct Firebase access
3. DON'T modify scoring rules
4. DON'T skip BaseQuarterComponent
5. DON'T use Angular CLI - use Nx
6. DON'T assume file locations
7. DON'T experiment with patterns

## WHEN STUCK
1. Re-read this document
2. Check file existence and content
3. Look for exact pattern needed
4. Ask for pattern clarification
5. Don't waste time experimenting

## PRE-RESPONSE CHECKLIST
Before responding to ANY request:

### 1. File Verification
- [ ] Listed directory contents
- [ ] Read relevant files
- [ ] Verified file existence

### 2. Pattern Compliance
- [ ] Matches quarter naming (MMYY)
- [ ] Uses FirebaseService
- [ ] Extends BaseQuarterComponent
- [ ] Follows web component pattern

### 3. Type Safety
- [ ] Used analysis tool
- [ ] Verified interfaces
- [ ] Checked scoring rules

Remember: Your role is to help maintain and improve this application while preserving its core patterns and rules.