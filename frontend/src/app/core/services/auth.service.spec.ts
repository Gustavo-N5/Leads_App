import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([
          { path: 'login', component: {} as any }
        ])
      ],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    http = TestBed.inject(HttpTestingController);
    localStorage.clear();
  });

  afterEach(() => { http.verify(); localStorage.clear(); });

  it('should be created', () => expect(service).toBeTruthy());

  it('hasValidToken() should return false when no token', () =>
    expect(service.hasValidToken()).toBeFalse());

  it('login() should store token and emit authenticated', () => {
    const mockRes = { token: 'jwt123', username: 'admin', expiresAt: '' };
    service.login({ username: 'admin', password: 'admin123' }).subscribe();
    http.expectOne(`${environment.apiUrl}/auth/login`).flush(mockRes);
    expect(localStorage.getItem('leads_token')).toBe('jwt123');
  });

  it('logout() should clear storage', () => {
    localStorage.setItem('leads_token', 'tok');
    service.logout();
    expect(localStorage.getItem('leads_token')).toBeNull();
  });

  it('getToken() should return stored token', () => {
    localStorage.setItem('leads_token', 'abc');
    expect(service.getToken()).toBe('abc');
  });
});