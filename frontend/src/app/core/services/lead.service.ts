import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Lead, LeadCreateDto, LeadUpdateDto } from '../models/lead.model';
import { PagedResult } from '../models/pagination.model';
import { environment } from '../../../environments/environment';

export interface LeadFilter {
  search?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}

@Injectable({ providedIn: 'root' })
export class LeadService {
  private url = `${environment.apiUrl}/leads`;

  constructor(private http: HttpClient) {}

  getAll(filter: LeadFilter = {}): Observable<PagedResult<Lead>> {
    let params = new HttpParams();
    if (filter.search) params = params.set('search', filter.search);
    if (filter.status) params = params.set('status', filter.status);
    params = params.set('page', filter.page ?? 1);
    params = params.set('pageSize', filter.pageSize ?? 10);
    return this.http.get<PagedResult<Lead>>(this.url, { params });
  }

  getById(id: number): Observable<Lead> {
    return this.http.get<Lead>(`${this.url}/${id}`);
  }

  create(dto: LeadCreateDto): Observable<Lead> {
    return this.http.post<Lead>(this.url, dto);
  }

  update(id: number, dto: LeadUpdateDto): Observable<Lead> {
    return this.http.put<Lead>(`${this.url}/${id}`, dto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}