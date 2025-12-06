import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { SessionService } from 'src/app/core/service/session.service';
import { expect } from '@jest/globals';
import { MeComponent } from './me.component';
import { UserService } from 'src/app/core/service/user.service';
import { of } from 'rxjs';
import { Router, provideRouter } from '@angular/router';
import { User } from 'src/app/core/models/user.interface';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('MeComponent', () => {
  let component: MeComponent;
  let fixture: ComponentFixture<MeComponent>;
  let router: Router;

  const mockSessionService = {
    sessionInformation: {
      admin: true,
      id: 1,
    },
    logOut: jest.fn(),
  };

  const mockUserService = {
    getById: jest.fn(),
    delete: jest.fn(),
  };

  // mockRouter supprimé car on utilise le vrai via provideRouter

  const mockMatSnackBar = {
    open: jest.fn(),
  };

  const mockUser: User = {
    id: 1,
    email: 'test@test.com',
    lastName: 'TEST',
    firstName: 'Toto',
    admin: true,
    password: '12345678!@Aa',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MeComponent,
        MatSnackBarModule,
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        NoopAnimationsModule,
      ],
      providers: [
        provideHttpClient(),
        provideRouter([]),
        { provide: SessionService, useValue: mockSessionService },
        { provide: UserService, useValue: mockUserService },
        { provide: MatSnackBar, useValue: mockMatSnackBar },
      ],
    })
      .overrideComponent(MeComponent, {
        set: {
          providers: [{ provide: MatSnackBar, useValue: mockMatSnackBar }],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(MeComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);

    mockUserService.getById.mockReturnValue(of(mockUser));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call userService.getById on init', () => {
    expect(mockUserService.getById).toHaveBeenCalledWith('1');
  });

  it('should go back when back function is called', () => {
    const spy = jest.spyOn(window.history, 'back');
    component.back();
    expect(spy).toHaveBeenCalled();
  });

  it('should delete account', () => {
    mockUserService.delete.mockReturnValue(of(null));
    const navigateSpy = jest.spyOn(router, 'navigate');

    component.delete();

    expect(mockUserService.delete).toHaveBeenCalledWith('1');
    expect(mockMatSnackBar.open).toHaveBeenCalled();
    expect(mockSessionService.logOut).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith(['/']);
  });
});
