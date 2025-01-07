import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { GameService } from '../services/game.service';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GameGuard implements CanActivate {
  constructor(
    private gameService: GameService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.gameService.getCurrentQuarter().pipe(
      map(quarter => {
        if (!quarter) {
          this.router.navigate(['/error'], { 
            queryParams: { 
              message: 'No active quarter found' 
            }
          });
          return false;
        }
        return true;
      }),
      catchError(error => {
        console.error('Game guard error:', error);
        this.router.navigate(['/error'], { 
          queryParams: { 
            message: 'Error loading game data' 
          }
        });
        return of(false);
      })
    );
  }
}