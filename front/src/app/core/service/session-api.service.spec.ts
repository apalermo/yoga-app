import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';
import { SessionApiService } from './session-api.service';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { Session } from '../models/session.interface';

describe('SessionApiService', () => {
  let service: SessionApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(SessionApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve all sessions', () => {
    const mockSessions: Session[] = [
      {
        id: 1,
        name: 'Yoga',
        description: 'Super session',
        date: new Date(),
        teacher_id: 1,
        users: [],
      },
    ];

    service.all().subscribe({
      next: (sessions) => {
        expect(sessions).toEqual(mockSessions);
      },
    });

    const req = httpMock.expectOne('api/session');
    expect(req.request.method).toBe('GET');
    req.flush(mockSessions);
  });

  const mockSession: Session = {
    id: 1,
    name: 'Yoga',
    description: 'Super session',
    date: new Date(),
    teacher_id: 1,
    users: [],
  };
  it('should retrieve session detail', () => {
    service.detail('1').subscribe({
      next: (session) => {
        expect(session).toEqual(mockSession);
      },
    });

    const req = httpMock.expectOne('api/session/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockSession);
  });

  it('should create a session', () => {
    const mockSession: Session = {
      name: 'New Yoga',
      description: 'Nouvelle super session',
      date: new Date(),
      teacher_id: 1,
      users: [],
    };

    service.create(mockSession).subscribe({
      next: (session) => {
        expect(session).toEqual(mockSession);
      },
    });

    const req = httpMock.expectOne('api/session');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockSession);
    req.flush(mockSession);
  });

  it('should delete a session', () => {
    service.delete('1').subscribe({ next: (res) => expect(res).toBeNull() });

    const req = httpMock.expectOne('api/session/1');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('should update a session', () => {
    service
      .update('1', mockSession)
      .subscribe({ next: (res) => expect(res).toEqual(mockSession) });

    const req = httpMock.expectOne('api/session/1');
    expect(req.request.method).toBe('PUT');
    req.flush(mockSession);
  });

  it('should participate to a session', () => {
    service
      .participate('1', '1')
      .subscribe({ next: (res) => expect(res).toBeNull() });

    const req = httpMock.expectOne('api/session/1/participate/1');
    expect(req.request.method).toBe('POST');
    req.flush(null);
  });

  it('should unParticipate to a session', () => {
    service
      .unParticipate('1', '1')
      .subscribe({ next: (res) => expect(res).toBeNull() });

    const req = httpMock.expectOne('api/session/1/participate/1');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
