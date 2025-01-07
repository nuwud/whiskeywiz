import { TestBed } from '@angular/core/testing';
import * as jasmine from 'jasmine-core';
import { Router } from '@angular/router';
import { FirebaseService } from './firebase.service';
import { Firestore } from '@angular/fire/firestore';
import { GameState } from '../shared/models/game.model';
import { Quarter } from '../shared/models/quarter.model';

describe('FirebaseService', () => {
  let service: FirebaseService;
  let firestoreSpy: jasmine.SpyObj<Firestore>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const fsSpy = jasmine.createSpyObj('Firestore', ['collection', 'doc']);
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        FirebaseService,
        { provide: Firestore, useValue: fsSpy },
        { provide: Router, useValue: routerSpyObj }
      ]
    });

    service = TestBed.inject(FirebaseService);
    firestoreSpy = TestBed.inject(Firestore) as jasmine.SpyObj<Firestore>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Quarter Management', () => {
    it('should validate MMYY format correctly', () => {
      const validQuarter: Quarter = {
        id: '0324',
        name: 'March 2024',
        active: true,
        samples: []
      };

      const invalidQuarter: Quarter = {
        id: '1524', // Invalid month
        name: 'Invalid Month',
        active: false,
        samples: []
      };

      expect(service['isValidMMYY'](validQuarter.id)).toBe(true);
      expect(service['isValidMMYY'](invalidQuarter.id)).toBe(false);
    });
  });

  describe('Game State Management', () => {
    it('should format game state ID correctly', () => {
      const playerId = 'player123';
      const quarterId = '0324';
      const gameState: GameState = {
        id: quarterId,
        status: 'active',
        name: 'Test Game'
      };

      // Test the game state save method
      service.saveGameProgress(playerId, gameState).subscribe();

      // The doc reference should be created with the correct ID format
      expect(firestoreSpy.doc).toHaveBeenCalledWith(
        jasmine.anything(),
        `${playerId}_${quarterId}`
      );
    });
  });

  describe('Error Handling', () => {
    it('should redirect to home on initialization failure', () => {
      firestoreSpy.collection.and.throwError('Firebase not initialized');
      
      // Create a new instance to trigger the error
      const errorService = new FirebaseService(firestoreSpy, routerSpy);
      
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
    });

    it('should throw error for uninitialized service', () => {
      // Force the service to be uninitialized
      service['initialized'] = false;
      
      expect(() => service.getQuarters().subscribe())
        .toThrowError('Firebase service not properly initialized');
    });
  });
});
