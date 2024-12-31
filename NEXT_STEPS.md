# Development Progress and Next Steps

## Current Status
- Working in `main` branch
- Fixing build errors from production build
- Just added GameModule and updated FirebaseService

## Recent Changes
1. Added src/app/shared/game/game.module.ts
   - Set up for lazy loading
   - Added proper imports/exports

2. Updated FirebaseService
   - Added getScoringRules
   - Added updateScoringRules
   - Fixed submitScore to return Observable

## Remaining Build Errors to Fix
1. Type Issues
   - Error TS2339: Property 'subscribe' does not exist on type 'Promise<void>'
   - Error TS2345: Argument of type 'Promise<void>' not assignable to Observable
   - Error TS2740: Type '{}' missing properties from 'ScoringRules'

2. Missing Dependencies
   - Need to verify game.module.ts has all required dependencies
   - May need to update app.module.ts imports

3. Auth/Permission Issues
   - Check auth-button.component.ts returnQuarter property
   - Verify player.component.ts collection access

## Next Steps (Priority Order)
1. Update remaining Promise returns to Observables in FirebaseService
2. Fix scoring rules type issues
3. Complete game module dependencies
4. Update auth components

## Files to Check
1. src/app/admin/admin.component.ts
2. src/app/auth/auth-button/auth-button.component.ts
3. src/app/player/player.component.ts
4. src/app/services/score.service.ts