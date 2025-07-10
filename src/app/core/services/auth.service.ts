import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { url } from '../models/url.model';
@Injectable({ providedIn: 'root' })
export class AuthService {
  // private apiUrl = 'https://gestionaleeconomicobe.onrender.com/api/auth';
  private apiUrl= url+'api/auth'

  // Inizializza lo stato leggendo il localStorage una sola volta all'avvio
  private loggedIn = new BehaviorSubject<boolean>(!!localStorage.getItem('jwt_token'));
  
  // Espone lo stato come un Observable pubblico
  isLoggedIn$ = this.loggedIn.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  public isLoggedIn(): boolean {
    return this.loggedIn.getValue();
  }

  register(userData: any): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/register`, userData);
  }
  
  login(credentials: any): Observable<{ token:string }> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        // Se la risposta contiene un token, salvalo e aggiorna lo stato
        if (response?.token) {
          localStorage.setItem('jwt_token', response.token);
          this.loggedIn.next(true); // Emetti il nuovo stato: l'utente è loggato
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('jwt_token');
    this.loggedIn.next(false); // Emetti il nuovo stato: l'utente non è più loggato
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('jwt_token');
  }
}