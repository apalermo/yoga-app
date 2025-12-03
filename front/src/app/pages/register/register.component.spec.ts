import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { expect } from '@jest/globals';

import { RegisterComponent } from './register.component';
import { AuthService } from 'src/app/core/service/auth.service';
import { RegisterRequest } from 'src/app/core/models/registerRequest.interface';
import { Router } from '@angular/router';
import { throwError, of } from 'rxjs';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  // Mocks
  const authServiceMock = {
    register: jest.fn(),
  };
  const routerMock = {
    navigate: jest.fn(),
  };
  const testUser: RegisterRequest = {
    email: 'toto@test.com',
    firstName: 'toto',
    lastName: 'test',
    password: '12345687!@A',
  };
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RegisterComponent,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
      ],
      providers: [
        provideHttpClient(),
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should authService.register and redirect on success', () => {
    authServiceMock.register.mockReturnValue(of(undefined));

    component.form.setValue(testUser);
    component.submit();

    expect(authServiceMock.register).toHaveBeenCalledWith(testUser);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should set onError to true on failure', () => {
    authServiceMock.register.mockReturnValue(
      throwError(() => new Error('Error'))
    );

    component.form.setValue(testUser);
    component.submit();

    expect(component.onError).toBe(true);
  });

  it('should ensure form is invalid if empty', () => {
    component.form.setValue({
      email: '',
      firstName: '',
      lastName: '',
      password: '',
    });
    expect(component.form.valid).toBeFalsy();
  });
});
