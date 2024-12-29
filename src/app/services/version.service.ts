// src/app/services/version.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class VersionService {
    constructor(private http: HttpClient) { }

    getVersion() {
        return this.http.get('/version.json').pipe(
            catchError(error => {
                console.warn('Version file not found, using default version');
                return of({ version: '1.0.0' });
            })
        );
    }
}