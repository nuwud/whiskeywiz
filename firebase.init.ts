import { InjectionToken } from '@angular/core';
import { FirebaseApp } from '@angular/fire/app';
import { environment } from 'src/environments/environment';
import { getApp, initializeApp } from 'firebase/app'; 
import { BehaviorSubject } from 'rxjs';                

export const FIREBASE_APP = new InjectionToken<FirebaseApp>('FIREBASE_APP');
export const FIREBASE_INIT_STATUS = new InjectionToken<BehaviorSubject<FirebaseInitStatus>>('FIREBASE_INIT_STATUS');

// Core providers for Firebase initialization

export interface FirebaseInitStatus {
    isInitialized: boolean;
    error?: string;
}

const initStatus = new BehaviorSubject<FirebaseInitStatus>({
    isInitialized: false
});

// Core providers for Firebase initialization
export const firebaseCoreProviders = [
    {
        provide: FIREBASE_APP,
        useFactory: () => {
            try {
                const app = initializeApp(environment.firebase);
                initStatus.next({ isInitialized: true });
                return app;
            } catch (e) {
                try {
                    const app = getApp();
                    initStatus.next({ isInitialized: true });
                    return app;
                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : 'Unknown Firebase initialization error';
                    initStatus.next({ 
                        isInitialized: false, 
                        error: errorMessage 
                    });
                    console.error('Firebase initialization failed:', error);
                    throw error;
                }
            }
        }
    },
    {
        provide: FIREBASE_INIT_STATUS,
        useValue: initStatus
    }
];