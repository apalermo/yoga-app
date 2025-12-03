import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { expect } from '@jest/globals';
import { of, throwError } from 'rxjs';
import { AuthService } from 'src/app/core/service/auth.service';
import { SessionService } from 'src/app/core/service/session.service';
import { LoginComponent } from './login.component';
import { SessionInformation } from '../../core/models/sessionInformation.interface';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  // Mocks
  const authServiceMock = {
    login: jest.fn(),
  };
  const sessionServiceMock = {
    logIn: jest.fn(),
  };
  const routerMock = {
    navigate: jest.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        LoginComponent,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
      ],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: SessionService, useValue: sessionServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call authService.login and redirect on success', () => {
    const sessionInfo: SessionInformation = {
      token: 'token',
      type: 'Bearer',
      id: 1,
      username: 'test',
      firstName: 'Test',
      lastName: 'Test',
      admin: false,
    };

    // On simule une réponse positive
    authServiceMock.login.mockReturnValue(of(sessionInfo));

    component.form.setValue({ email: 'test@test.com', password: 'pwd' });
    component.submit();

    expect(authServiceMock.login).toHaveBeenCalledWith({
      email: 'test@test.com',
      password: 'pwd',
    });
    expect(sessionServiceMock.logIn).toHaveBeenCalledWith(sessionInfo);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/sessions']);
  });

  it('should set onError to true on failure', () => {
    // On simule une erreur
    authServiceMock.login.mockReturnValue(throwError(() => new Error('Error')));

    component.form.setValue({ email: 'test@test.com', password: 'pwd' });
    component.submit();

    expect(component.onError).toBe(true);
  });
});
