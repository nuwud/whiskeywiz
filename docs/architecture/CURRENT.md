# WhiskeyWiz Architecture Overview - January 2025

## Game Structure

### 1. Quarter Components

#### Base Structure
```typescript
src/app/quarters/
├── base-quarter.component.ts    // Base functionality
├── quarter.component.ts         // Router outlet component
├── quarters.module.ts           // Module registration
└── {MMYY}/                     // Individual quarters
    └── {MMYY}.component.ts      // Quarter-specific logic
```

#### Component Hierarchy
1. **BaseQuarterComponent**
   - Provides common functionality
   - Handles Firebase services
   - Manages game state
   - Processes guesses

2. **Individual Quarter Components (e.g., Q0324Component)**
   - Extend BaseQuarterComponent
   - Quarter-specific configuration
   - Custom game logic if needed
   - Both web component and routed access

3. **QuarterComponent**
   - Handles route parameters
   - Manages game state transitions
   - Supports embedded mode

### 2. Web Component Integration

#### Registration
- Each quarter is registered as a web component
- Format: `whiskey-wiz-{mmyy}` (e.g., whiskey-wiz-0324)
- Handled in QuartersModule constructor

#### Access Methods
1. **Direct Browser Access**
   ```
   /#/quarters/0324
   ```

2. **Embedded Component**
   ```html
   <whiskey-wiz-0324></whiskey-wiz-0324>
   ```

### 3. Services Architecture

#### Game Service
- Manages game state
- Handles quarter loading
- Navigation control
- State persistence

#### Firebase Service
- Database operations
- Quarter data management
- Player progress tracking
- Score management

#### Analytics Service
- Tracks game events
- Player behavior analysis
- Performance monitoring

## Admin Structure

### 1. Admin Module
```typescript
src/app/admin/
├── admin.module.ts             // Admin module configuration
├── admin.component.ts          // Main admin interface
├── admin-routing.module.ts     // Admin route configuration
└── quarters/                   // Quarter management
    └── admin-quarters.component.ts
```

### 2. Access Patterns
1. **Direct Admin Access**
   ```
   /#/admin
   ```

2. **Quarter Management**
   ```
   /#/admin/quarters
   /#/admin/quarters/{mmyy}/edit
   /#/admin/quarters/new
   ```

## Key Architectural Decisions

### 1. MMYY Format
- Consistent format: MMYY (e.g., 0324)
- Validation: MM (01-12), YY (20-99)
- Used in routes and components

### 2. Component Strategy
- Separate component per quarter
- Base component for shared logic
- Web components for embedding

### 3. Routing Strategy
- Hash-based for Shopify compatibility
- Lazy-loaded admin module
- Direct and embedded access support

## Implementation Requirements

### 1. Quarter Components Must:
- Extend BaseQuarterComponent
- Provide quarter-specific configuration
- Support both access methods
- Handle state management

### 2. Admin Module Must:
- Verify admin access
- Manage quarter lifecycle
- Support quarter preview
- Handle deployment

### 3. Web Components Must:
- Register with correct naming
- Handle embedding scenarios
- Manage state independently
- Support Shopify integration

## Development Guidelines

### 1. New Quarter Creation
1. Create MMYY directory
2. Implement component extending base
3. Add to QUARTER_COMPONENTS
4. Update documentation

### 2. Testing Requirements
1. Direct URL access
2. Embedded component
3. Admin management
4. State persistence

### 3. Documentation
- Update ARCHITECTURE_JAN2025.md
- Document quarter-specific changes
- Maintain testing records

Last Updated: January 2025