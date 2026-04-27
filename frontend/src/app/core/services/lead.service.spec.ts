import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { LeadService } from './lead.service';
import { environment } from '../../../environments/environment';

describe('LeadService', () => {
  let service: LeadService;
  let http: HttpTestingController;
  const url = `${environment.apiUrl}/leads`;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule], providers: [LeadService] });
    service = TestBed.inject(LeadService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('getAll() should call GET with params', () => {
    service.getAll({ page: 1, pageSize: 10 }).subscribe();
    const req = http.expectOne(r => r.url === url);
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('page')).toBe('1');
    req.flush({ items: [], total: 0, page: 1, pageSize: 10 });
  });

  it('create() should call POST', () => {
    const dto = { name: 'John', email: 'j@j.com', status: 'New' as const };
    service.create(dto).subscribe();
    const req = http.expectOne(url);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(dto);
    req.flush({ id: 1, ...dto, createdAt: '', updatedAt: '', tasksCount: 0 });
  });

  it('update() should call PUT with id', () => {
    const dto = { name: 'Jane', email: 'j@j.com', status: 'Won' as const };
    service.update(1, dto).subscribe();
    const req = http.expectOne(`${url}/1`);
    expect(req.request.method).toBe('PUT');
    req.flush({ id: 1, ...dto, createdAt: '', updatedAt: '', tasksCount: 0 });
  });

  it('delete() should call DELETE with id', () => {
    service.delete(1).subscribe();
    const req = http.expectOne(`${url}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});