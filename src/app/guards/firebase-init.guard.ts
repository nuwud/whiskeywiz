import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';

@Injectable({
  providedIn: 'root'
})
export class FirebaseInitGuard implements CanActivate {
  constructor(private firebaseService: FirebaseService) {}

  canActivate(): boolean {
    if (this.firebaseService.isInitialized()) {
      return true;
    } else {
      console.error('Firebase is not initialized!');
      return false;
    }
  }
}
