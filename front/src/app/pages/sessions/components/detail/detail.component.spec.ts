import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { expect } from '@jest/globals';
import { SessionService } from '../../../../core/service/session.service';
import { DetailComponent } from './detail.component';
import { provideHttpClient } from '@angular/common/http';
import { SessionApiService } from 'src/app/core/service/session-api.service';
import { TeacherService } from 'src/app/core/service/teacher.service';
import { ActivatedRoute, Router, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { Session } from 'src/app/core/models/session.interface';
import { Teacher } from 'src/app/core/models/teacher.interface';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('DetailComponent', () => {
  let component: DetailComponent;
  let fixture: ComponentFixture<DetailComponent>;
  let router: Router;

  // --- MOCKS ---
  const mockSessionService = {
    sessionInformation: { admin: true, id: 1 },
  };

  const mockSessionApiService = {
    detail: jest.fn(),
    delete: jest.fn(),
    participate: jest.fn(),
    unParticipate: jest.fn(),
  };

  const mockTeacherService = {
    detail: jest.fn(),
  };

  const mockMatSnackBar = {
    open: jest.fn(),
  };

  // On mocke ActivatedRoute pour simuler l'ID dans l'URL
  const mockActivatedRoute = {
    snapshot: { paramMap: { get: () => '1' } },
  };

  // --- DONNÉES DE TEST ---
  const mockSession: Session = {
    id: 1,
    name: 'Yoga Session',
    description: 'Description',
    date: new Date(),
    teacher_id: 99,
    users: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockTeacher: Teacher = {
    id: 99,
    firstName: 'Toto',
    lastName: 'TEST',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        DetailComponent, // Standalone
        NoopAnimationsModule,
        ReactiveFormsModule,
        MatCardModule,
        MatIconModule,
        MatSnackBarModule, // On garde le module pour satisfaire les dépendances internes
      ],
      providers: [
        provideHttpClient(),
        provideRouter([]), // Fournit le Router réel
        { provide: SessionService, useValue: mockSessionService },
        { provide: SessionApiService, useValue: mockSessionApiService },
        { provide: TeacherService, useValue: mockTeacherService },
        { provide: MatSnackBar, useValue: mockMatSnackBar },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    })
      // Force l'injection de notre mock MatSnackBar dans le composant
      .overrideComponent(DetailComponent, {
        set: {
          providers: [{ provide: MatSnackBar, useValue: mockMatSnackBar }],
        },
      })
      .compileComponents();
  });

  // Helper pour créer le composant après avoir configuré les mocks
  const createComponent = () => {
    fixture = TestBed.createComponent(DetailComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router); // On récupère le router pour l'espionner
    fixture.detectChanges();
  };

  it('should create', () => {
    mockSessionApiService.detail.mockReturnValue(of(mockSession));
    mockTeacherService.detail.mockReturnValue(of(mockTeacher));
    createComponent();
    expect(component).toBeTruthy();
  });

  it('should delete session upon click on delete button', () => {
    // ARRANGE
    mockSessionService.sessionInformation.admin = true;
    mockSessionApiService.detail.mockReturnValue(of(mockSession));
    mockTeacherService.detail.mockReturnValue(of(mockTeacher));
    mockSessionApiService.delete.mockReturnValue(of(null)); // Succès delete

    createComponent();

    // Espion sur la navigation
    const navigateSpy = jest.spyOn(router, 'navigate');

    // ACT
    const deleteButton = fixture.nativeElement.querySelector(
      'button[color="warn"]'
    );
    deleteButton.click();

    // ASSERT
    expect(mockSessionApiService.delete).toHaveBeenCalledWith('1');
    expect(mockMatSnackBar.open).toHaveBeenCalledWith(
      'Session deleted !',
      'Close',
      { duration: 3000 }
    );
    expect(navigateSpy).toHaveBeenCalledWith(['sessions']);
  });

  it('should display session name and teacher name', () => {
    mockSessionApiService.detail.mockReturnValue(of(mockSession));
    mockTeacherService.detail.mockReturnValue(of(mockTeacher));
    createComponent();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Yoga Session');
    expect(compiled.querySelector('mat-card-subtitle')?.textContent).toContain(
      'Toto TEST'
    );
  });

  it('should display delete button if user is admin', () => {
    mockSessionService.sessionInformation.admin = true;
    mockSessionApiService.detail.mockReturnValue(of(mockSession));
    mockTeacherService.detail.mockReturnValue(of(mockTeacher));
    createComponent();

    const deleteButton = fixture.nativeElement.querySelector(
      'button[color="warn"]'
    );
    expect(deleteButton).toBeTruthy();
  });

  it('should NOT display delete button if user is NOT admin', () => {
    mockSessionService.sessionInformation.admin = false;
    mockSessionApiService.detail.mockReturnValue(of(mockSession));
    mockTeacherService.detail.mockReturnValue(of(mockTeacher));
    createComponent();

    const deleteBtn = fixture.nativeElement.querySelector(
      'button[color="warn"]'
    );
    expect(deleteBtn).toBeFalsy();
  });

  it('should display participate button if user is not admin and not participating', () => {
    mockSessionService.sessionInformation.admin = false;
    mockSession.users = [];
    mockSessionApiService.detail.mockReturnValue(of(mockSession));
    mockTeacherService.detail.mockReturnValue(of(mockTeacher));
    createComponent();

    const participateBtn = fixture.nativeElement.querySelector(
      'button[color="primary"]'
    );
    expect(participateBtn).toBeTruthy();
  });

  it('should display unParticipate button if user is not admin and IS participating', () => {
    mockSessionService.sessionInformation.admin = false;
    mockSessionService.sessionInformation.id = 1;
    const sessionWithUser = { ...mockSession, users: [1] };
    mockSessionApiService.detail.mockReturnValue(of(sessionWithUser));
    mockTeacherService.detail.mockReturnValue(of(mockTeacher));
    createComponent();

    const unParticipateBtn = fixture.nativeElement.querySelector(
      'button[color="warn"]'
    );
    expect(unParticipateBtn).toBeTruthy();
  });
});
