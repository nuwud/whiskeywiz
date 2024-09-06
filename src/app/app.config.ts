import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideFirebaseApp(() => initializeApp({"projectId":"whiskey-wiz","appId":"1:59687027751:web:219535d48754b705f67a02","storageBucket":"whiskey-wiz.appspot.com","locationId":"us-central","apiKey":"AIzaSyC0Ugf4ZdJvW69YbDHYJT4IdfCVwRrUI2o","authDomain":"whiskey-wiz.firebaseapp.com","messagingSenderId":"59687027751","measurementId":"G-C14M2K1D7J"})), provideFirestore(() => getFirestore())]
};
