import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TaskService } from './task.service';
import { environment } from '../../../environments/environment';

describe('TaskService', () => {
  let service: TaskService;
  let http: HttpTestingController;
  const base = (id: number) => `${environment.apiUrl}/leads/${id}/tasks`;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule], providers: [TaskService] });
    service = TestBed.inject(TaskService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('getAll() should call GET /leads/:id/tasks', () => {
    service.getAll(1).subscribe();
    const req = http.expectOne(base(1));
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('create() should call POST', () => {
    const dto = { title: 'Task', status: 'Todo' as const };
    service.create(1, dto).subscribe();
    const req = http.expectOne(base(1));
    expect(req.request.method).toBe('POST');
    req.flush({ id: 1, leadId: 1, ...dto, createdAt: '', updatedAt: '' });
  });

  it('update() should call PUT /leads/:leadId/tasks/:taskId', () => {
    const dto = { title: 'Updated', status: 'Done' as const };
    service.update(1, 2, dto).subscribe();
    const req = http.expectOne(`${base(1)}/2`);
    expect(req.request.method).toBe('PUT');
    req.flush({ id: 2, leadId: 1, ...dto, createdAt: '', updatedAt: '' });
  });

  it('delete() should call DELETE', () => {
    service.delete(1, 2).subscribe();
    const req = http.expectOne(`${base(1)}/2`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});