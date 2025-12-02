import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';

import { TeacherService } from './teacher.service';
import { Teacher } from '../models/teacher.interface';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';

describe('TeacherService', () => {
  let service: TeacherService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(TeacherService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Vérifie qu'il n'y a pas de requêtes en attente
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  const testTeacher: Teacher = {
    id: 1,
    lastName: 'Last',
    firstName: 'First',
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  // Test de la méthode ALL
  it('should send a GET request to all and return an array of teachers ', () => {
    // Appel de la méthode et vérification de la sortie
    service.all().subscribe({
      next: (response) => {
        expect(response).toEqual([testTeacher]);
      },
    });

    // Vérification de la requête sortante

    const req = httpMock.expectOne('api/teacher');
    expect(req.request.method).toBe('GET');

    req.flush([testTeacher]);
  });

  // Test de la méthode DETAIL
  it('should send a GET request to detail and return a teacher', () => {
    // Appel de la méthode

    const teacherId = '1';
    service.detail(teacherId).subscribe({
      next: (response) => {
        expect(response).toEqual(testTeacher); // plus sûr pour les objets
      },
    });

    // Vérification de la requête sortante

    const req = httpMock.expectOne('api/teacher/' + teacherId);
    expect(req.request.method).toBe('GET');

    req.flush(testTeacher);
  });
});
