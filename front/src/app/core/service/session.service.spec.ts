import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';
import { SessionService } from './session.service';
import { SessionInformation } from '../models/sessionInformation.interface';

describe('SessionService', () => {
  let service: SessionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SessionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start with isLogged = false', () => {
    // On s'abonne à l'observable pour vérifier sa valeur initiale
    let isLogged: boolean | undefined;
    service.$isLogged().subscribe({ next: (val) => (isLogged = val) });

    expect(isLogged).toBe(false);
  });

  it('should set isLogged to true when logIn is called', () => {
    const user: SessionInformation = {
      token: 'token',
      id: 1,
      type: 'Bearer',
      username: 'user',
      firstName: 'First',
      lastName: 'Last',
      admin: false,
    };

    // ACTION
    service.logIn(user);

    // VERIFICATION
    expect(service.isLogged).toBe(true);
    expect(service.sessionInformation).toEqual(user);

    // Vérification de l'observable
    let isLoggedObservable: boolean | undefined;
    service
      .$isLogged()
      .subscribe({ next: (val) => (isLoggedObservable = val) });
    expect(isLoggedObservable).toBe(true);
  });

  it('should set isLogged to false when logOut is called', () => {
    // SETUP (On le met dans un état connecté d'abord)
    service.isLogged = true;

    // ACTION
    service.logOut();

    // VERIFICATION
    expect(service.isLogged).toBe(false);
    expect(service.sessionInformation).toBeUndefined();

    // Vérification de l'observable
    let isLoggedObservable: boolean | undefined;
    service
      .$isLogged()
      .subscribe({ next: (val) => (isLoggedObservable = val) });
    expect(isLoggedObservable).toBe(false);
  });
});
