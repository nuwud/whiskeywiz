import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, map } from 'rxjs';
import { GameService } from '../services/game.service';

@Injectable({
  providedIn: 'root'
})
export class GameGuard implements CanActivate {
  constructor(private gameService: GameService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return true; // Temporarily return true while we implement proper game service
  }
}

// Export both the class and a convenience constant
export const gameGuard = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  return new GameGuard(new GameService()).canActivate(route, state);
};