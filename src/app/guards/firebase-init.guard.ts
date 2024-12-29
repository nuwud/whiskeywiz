import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { FirebaseApp } from '@angular/fire/app';
import { Inject } from '@angular/core';
import { FIREBASE_APP } from '../app.module';

@Injectable({
  providedIn: 'root'
})
export class FirebaseInitGuard implements CanActivate {
  constructor(@Inject(FIREBASE_APP) private app: FirebaseApp) {}

  canActivate(): boolean {
    if (!this.app) {
      console.error('Firebase not initialized');
      return false;
    }
    return true;
  }
}
