import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';
import { AuthService } from './auth.service';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { LoginRequest } from '../models/loginRequest.interface';
import { SessionInformation } from '../models/sessionInformation.interface';
import { RegisterRequest } from '../models/registerRequest.interface';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController; // Le "Mouchard" réseau

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(), // Fournit le client HTTP réel
        provideHttpClientTesting(), // Remplace le backend par notre mouchard
      ],
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  // Après chaque test, on vérifie qu'il n'y a pas de requête "fantôme" qui traîne
  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // Test de la méthode REGISTER
  it('should send a POST request to register', () => {
    // 1. Données de test
    const mockRegisterRequest: RegisterRequest = {
      email: 'test@test.com',
      firstName: 'Test',
      lastName: 'Test',
      password: 'password',
    };

    // 2. Appel de la méthode (On s'abonne pour déclencher la requête)
    service.register(mockRegisterRequest).subscribe();

    // 3. Vérification de la requête sortante
    const req = httpMock.expectOne('/api/auth/register'); // On attend un appel vers cette URL
    expect(req.request.method).toBe('POST'); // On attend un POST
    expect(req.request.body).toEqual(mockRegisterRequest); // On vérifie que le corps est bon

    // 4. Simulation de la réponse (Vide car register renvoie Observable<void>)
    req.flush(null);
  });

  // Test de la méthode LOGIN
  it('should send a POST request to login and return token', () => {
    // 1. Données de test
    const mockLoginRequest: LoginRequest = {
      email: 'test@test.com',
      password: 'password',
    };

    // Ce que le "faux" backend doit renvoyer
    const mockSessionInfo: SessionInformation = {
      token: 'jwt-token',
      type: 'Bearer',
      id: 1,
      username: 'test',
      firstName: 'First',
      lastName: 'Last',
      admin: false,
    };

    // 2. Appel et vérification du retour
    service.login(mockLoginRequest).subscribe({
      next: (response) => {
        expect(response).toEqual(mockSessionInfo); // On vérifie que le service nous rend bien ce qu'il a reçu
      },
    });

    // 3. Interception de la requête
    const req = httpMock.expectOne('/api/auth/login');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockLoginRequest);

    // 4. Envoi de la réponse simulée
    req.flush(mockSessionInfo);
  });
});
