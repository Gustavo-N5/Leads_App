import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { authGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Component } from '@angular/core';

@Component({ template: '' })
class DummyComponent {}

describe('authGuard', () => {
  let authService: jasmine.SpyObj<AuthService>;
  let router: Router;

  beforeEach(() => {
    authService = jasmine.createSpyObj('AuthService', ['hasValidToken']);
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([
        { path: 'login', component: DummyComponent }
      ])],
      declarations: [DummyComponent],
      providers: [{ provide: AuthService, useValue: authService }]
    });
    router = TestBed.inject(Router);
  });

  it('should allow when token exists', () => {
    authService.hasValidToken.and.returnValue(true);
    const result = TestBed.runInInjectionContext(() =>
      authGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
    );
    expect(result).toBeTrue();
  });

  it('should redirect to /login when no token', () => {
    authService.hasValidToken.and.returnValue(false);
    const spy = spyOn(router, 'navigate');
    const result = TestBed.runInInjectionContext(() =>
      authGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
    );
    expect(result).toBeFalse();
    expect(spy).toHaveBeenCalledWith(['/login']);
  });
});