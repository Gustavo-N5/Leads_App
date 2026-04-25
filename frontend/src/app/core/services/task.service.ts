import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TaskItem, TaskCreateDto, TaskUpdateDto } from '../models/task.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class TaskService {
  constructor(private http: HttpClient) {}

  private url(leadId: number) {
    return `${environment.apiUrl}/leads/${leadId}/tasks`;
  }

  getAll(leadId: number): Observable<TaskItem[]> {
    return this.http.get<TaskItem[]>(this.url(leadId));
  }

  create(leadId: number, dto: TaskCreateDto): Observable<TaskItem> {
    return this.http.post<TaskItem>(this.url(leadId), dto);
  }

  update(leadId: number, taskId: number, dto: TaskUpdateDto): Observable<TaskItem> {
    return this.http.put<TaskItem>(`${this.url(leadId)}/${taskId}`, dto);
  }

  delete(leadId: number, taskId: number): Observable<void> {
    return this.http.delete<void>(`${this.url(leadId)}/${taskId}`);
  }
}