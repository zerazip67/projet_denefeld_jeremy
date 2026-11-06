import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Pollution, PollutionInput } from '../models/pollution';

@Injectable({
  providedIn: 'root',
})
export class PollutionService {
  private readonly http = inject(HttpClient);
  private readonly pollutionUrl = `${environment.apiUrl}/pollutions`;

  getAll(): Observable<Pollution[]> {
    return this.http.get<Pollution[]>(this.pollutionUrl);
  }

  getById(id: number): Observable<Pollution> {
    return this.http.get<Pollution>(`${this.pollutionUrl}/${id}`);
  }

  create(pollution: PollutionInput): Observable<Pollution> {
    return this.http.post<Pollution>(this.pollutionUrl, pollution);
  }

  update(id: number, pollution: PollutionInput): Observable<Pollution> {
    return this.http.put<Pollution>(`${this.pollutionUrl}/${id}`, pollution);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.pollutionUrl}/${id}`);
  }
}
