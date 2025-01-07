import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, take, tap } from 'rxjs/operators';
import { GameService } from '../services/game.service';
import { Quarter } from '../shared/models/quarter.model';

@Injectable({
  providedIn: 'root'
})
export class QuarterResolver implements Resolve<Quarter | null> {
  constructor(
    private gameService: GameService,
    private router: Router
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Quarter | null> {
    const quarterId = route.params['quarterId'] || route.queryParams['quarter'];

    if (quarterId) {
      return this.gameService.getQuarter(quarterId).pipe(
        take(1),
        tap(quarter => {
          if (!quarter) {
            this.router.navigate(['/error'], {
              queryParams: { message: 'Quarter not found' }
            });
          }
        }),
        catchError(error => {
          console.error('Quarter resolver error:', error);
          this.router.navigate(['/error'], {
            queryParams: { message: 'Error loading quarter data' }
          });
          return of(null);
        })
      );
    }

    return this.gameService.getCurrentQuarter().pipe(
      take(1),
      tap(quarter => {
        if (!quarter) {
          this.router.navigate(['/error'], {
            queryParams: { message: 'No active quarter found' }
          });
        }
      }),
      catchError(error => {
        console.error('Current quarter resolver error:', error);
        this.router.navigate(['/error'], {
          queryParams: { message: 'Error loading current quarter' }
        });
        return of(null);
      })
    );
  }
}