import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatToolbarModule } from '@angular/material/toolbar';
import { expect } from '@jest/globals';
import { AppComponent } from './app.component';
import { Router, provideRouter } from '@angular/router';
import { SessionService } from './core/service/session.service';
import { of } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let router: Router;

  const mockSessionService = {
    $isLogged: jest.fn().mockReturnValue(of(true)),
    logOut: jest.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent, MatToolbarModule],
      providers: [
        provideHttpClient(),
        provideRouter([]),
        { provide: SessionService, useValue: mockSessionService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should call sessionService.logOut and redirect to home on logout', () => {
    // ARRANGE
    const navigateSpy = jest.spyOn(router, 'navigate');

    // ACT
    component.logout();

    // ASSERT
    expect(mockSessionService.logOut).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith(['']);
  });
});
