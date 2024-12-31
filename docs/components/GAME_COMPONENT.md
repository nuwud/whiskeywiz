# Game Component Documentation

## Overview

The GameComponent is the core gameplay component of Whiskey Wiz. It manages the sample guessing interface, user interactions, and score calculation.

## Component Structure

```typescript
@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit, OnDestroy {
  // Component implementation
}
```

## Key Features

1. Sample Navigation:
   - Handles progression through four whiskey samples (A, B, C, D)
   - Manages sample state and user guesses
   - Provides navigation controls

2. User Input Management:
   - Age slider (0-30 years)
   - Proof slider (80-160 proof)
   - Mashbill selection
   - Optional rating input

3. Score Calculation:
   - Real-time scoring feedback
   - Final score compilation
   - Bonus point calculation

## Dependencies

```typescript
constructor(
  private gameService: GameService,
  private scoreService: ScoreService,
  private analyticsService: AnalyticsService
) {}
```

## State Management

```typescript
interface GameState {
  currentSample: 'A' | 'B' | 'C' | 'D';
  guesses: {
    [key: string]: {
      age: number;
      proof: number;
      mashbill: string;
      rating?: number;
    };
  };
  isComplete: boolean;
}
```

## Analytics Integration

The component tracks:
1. Sample Interactions:
   - Time spent per sample
   - Guess changes
   - Navigation patterns

2. User Behavior:
   - Completion rates
   - Average guess accuracy
   - Rating patterns

## Usage Example

```html
<!-- In template -->
<app-game
  [quarterId]="'Q12024'"
  [isPreview]="false"
  (gameComplete)="onGameComplete($event)">
</app-game>
```

## Event Handling

```typescript
// Input Events
onAgeChange(value: number): void;
onProofChange(value: number): void;
onMashbillSelect(type: string): void;
onRatingChange(value: number): void;

// Navigation Events
onSampleChange(sample: string): void;
onGameComplete(): void;
```

## Styling

Key CSS classes:
```scss
.game-container {
  // Main container styles
}

.sample-navigation {
  // Navigation controls
}

.input-container {
  // Input controls styling
}
```

## Testing

```typescript
describe('GameComponent', () => {
  let component: GameComponent;
  let fixture: ComponentFixture<GameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GameComponent ],
      imports: [ SharedModule ],
      providers: [
        GameService,
        ScoreService,
        AnalyticsService
      ]
    })
    .compileComponents();
  });

  // Test cases...
});
```

## Error Handling

1. Input Validation:
   - Age range checks
   - Proof range validation
   - Required field handling

2. State Management:
   - Invalid sample navigation
   - Incomplete submission prevention
   - Service error handling

## Performance Considerations

1. Change Detection:
   - Uses OnPush strategy
   - Implements trackBy functions
   - Optimizes number of subscriptions

2. Memory Management:
   - Proper subscription cleanup
   - State reset on destruction
   - Cached calculation results

## Future Improvements

1. Planned Enhancements:
   - Additional input validations
   - Enhanced animation states
   - Improved error feedback

2. Technical Debt:
   - Refactor state management
   - Improve test coverage
   - Optimize event handlers

## Related Components

- ResultsComponent
- SampleNavigationComponent
- InputControlsComponent

## Contributing

When modifying the GameComponent:
1. Follow the established state management pattern
2. Update analytics tracking as needed
3. Maintain test coverage
4. Document significant changes