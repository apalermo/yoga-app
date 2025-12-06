import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router, ActivatedRoute, provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { expect } from '@jest/globals';
import { of } from 'rxjs';
import { SessionService } from 'src/app/core/service/session.service';
import { SessionApiService } from '../../../../core/service/session-api.service';
import { FormComponent } from './form.component';
import { Session } from 'src/app/core/models/session.interface';

describe('FormComponent', () => {
  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;

  // --- MOCKS ---
  const mockSessionService = {
    sessionInformation: { admin: true },
  };

  const mockSessionApiService = {
    create: jest.fn(),
    update: jest.fn(),
    detail: jest.fn(),
  };

  const mockRouter = {
    url: '/sessions/create',
    navigate: jest.fn(),
  };

  const mockMatSnackBar = {
    open: jest.fn(),
  };

  const mockActivatedRoute = {
    snapshot: { paramMap: { get: jest.fn().mockReturnValue('1') } },
  };

  const mockSession: Session = {
    id: 1,
    name: 'Yoga Session',
    description: 'Description',
    date: new Date(),
    teacher_id: 1,
    users: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormComponent,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        MatSnackBarModule,
        MatSelectModule,
        NoopAnimationsModule,
      ],
      providers: [
        provideHttpClient(),
        provideRouter([]),
        { provide: SessionService, useValue: mockSessionService },
        { provide: SessionApiService, useValue: mockSessionApiService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: MatSnackBar, useValue: mockMatSnackBar },
      ],
    })
      .overrideComponent(FormComponent, {
        set: {
          providers: [{ provide: MatSnackBar, useValue: mockMatSnackBar }],
        },
      })
      .compileComponents();
  });

  it('should create', () => {
    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should init in Create mode', () => {
    mockRouter.url = '/sessions/create';

    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.onUpdate).toBe(false);
    expect(component.sessionForm?.value.name).toBe('');
  });

  it('should init in Update mode', () => {
    mockRouter.url = '/sessions/update/1';
    mockSessionApiService.detail.mockReturnValue(of(mockSession));

    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.onUpdate).toBe(true);
    expect(mockSessionApiService.detail).toHaveBeenCalledWith('1');
    expect(component.sessionForm?.value.name).toBe('Yoga Session');
  });

  it('should call create API on submit when in Create mode', () => {
    mockRouter.url = '/sessions/create';
    mockSessionApiService.create.mockReturnValue(of(mockSession));

    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.sessionForm?.setValue({
      name: 'New Session',
      date: '2025-01-01',
      teacher_id: 1,
      description: 'Description',
    });

    component.submit();

    expect(mockSessionApiService.create).toHaveBeenCalled();
    expect(mockMatSnackBar.open).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['sessions']);
  });

  it('should call update API on submit when in Update mode', () => {
    mockRouter.url = '/sessions/update/1';
    mockSessionApiService.detail.mockReturnValue(of(mockSession));
    mockSessionApiService.update.mockReturnValue(of(mockSession));

    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.sessionForm?.patchValue({
      name: 'Updated Session',
      description: 'Updated Description',
    });

    component.submit();

    expect(mockSessionApiService.update).toHaveBeenCalled();
    expect(mockMatSnackBar.open).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['sessions']);
  });

  it('should redirect if user is not admin', () => {
    mockSessionService.sessionInformation.admin = false;

    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/sessions']);
  });
});
