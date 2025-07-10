import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DashboardSummary } from '../models/dashboard-summary.model';
import { url } from '../models/url.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  // private apiUrl = 'https://gestionaleeconomicobe.onrender.com/api/dashboard';
  private apiUrl= url+'api/dashboard'

  constructor(private http: HttpClient) {}

  getSummary(): Observable<DashboardSummary> {
    return this.http.get<DashboardSummary>(`${this.apiUrl}/summary`);
  }
}