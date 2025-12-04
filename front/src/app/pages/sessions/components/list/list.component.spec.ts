import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { expect } from '@jest/globals';
import { SessionService } from 'src/app/core/service/session.service';
import { ListComponent } from './list.component';
import { of } from 'rxjs';
import { Session } from 'src/app/core/models/session.interface';
import { SessionApiService } from 'src/app/core/service/session-api.service';
import { provideRouter } from '@angular/router';

describe('ListComponent', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;

  // 1. Mock du SessionService pour contrôler le statut Admin
  const mockSessionService = {
    sessionInformation: {
      admin: true,
    },
  };

  // 2. Mock du SessionApiService pour fournir les fausses sessions
  const mockSessionApiService = {
    all: jest.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // ListComponent est Standalone, on l'importe directement
      imports: [ListComponent, MatCardModule, MatIconModule],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        { provide: SessionApiService, useValue: mockSessionApiService },
        provideHttpClient(),
        provideRouter([]),
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    // On simule un retour vide par défaut pour la création
    mockSessionApiService.all.mockReturnValue(of([]));
    expect(component).toBeTruthy();
  });

  it('should display sessions', () => {
    // ARRANGE : On prépare une liste de 2 sessions
    const sessions: Session[] = [
      {
        id: 1,
        name: 'Session 1',
        description: 'Description 1',
        date: new Date(),
        teacher_id: 1,
        users: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        name: 'Session 2',
        description: 'Description 2',
        date: new Date(),
        teacher_id: 2,
        users: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    mockSessionApiService.all.mockReturnValue(of(sessions));
    fixture.detectChanges();

    expect(mockSessionApiService.all).toHaveBeenCalled();
    // ASSERT : On vérifie qu'il y a bien 2 éléments avec la classe ".item"
    const items = fixture.nativeElement.querySelectorAll('.item');
    expect(items.length).toBe(2);
    // On vérifie que le texte est correct
    expect(items[0].textContent).toContain('Session 1');
    expect(items[1].textContent).toContain('Session 2');
  });

  it('should display edit button if user is admin', () => {
    // ARRANGE
    mockSessionService.sessionInformation.admin = true; // On simule un Admin
    const sessions: Session[] = [
      {
        id: 1,
        name: 'Session 1',
        description: 'Description 1',
        date: new Date(),
        teacher_id: 1,
        users: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    mockSessionApiService.all.mockReturnValue(of(sessions));

    fixture.detectChanges();

    // ASSERT : On cherche le bouton Edit
    const element: HTMLElement = fixture.nativeElement;
    const editButton = element.querySelector(
      'button[ng-reflect-router-link^="update"]'
    );
    expect(editButton).toBeDefined();
  });

  it('should not display edit button if user is not admin', () => {
    // ARRANGE
    mockSessionService.sessionInformation.admin = false; // On simule un User simple
    const sessions: Session[] = [
      {
        id: 1,
        name: 'Session 1',
        description: 'Description 1',
        date: new Date(),
        teacher_id: 1,
        users: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    mockSessionApiService.all.mockReturnValue(of(sessions));

    fixture.detectChanges();

    // ASSERT : Le bouton Edit ne doit pas apparaître
    const element: HTMLElement = fixture.nativeElement;
    const editButton =
      element.querySelector('button[ng-reflect-router-link^="update"]') ||
      undefined;
    expect(editButton).toBeUndefined();
  });
});
