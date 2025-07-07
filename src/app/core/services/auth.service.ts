import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';
  
  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());
  isLoggedIn$ = this.loggedIn.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    // Controlla lo stato dell'autenticazione al caricamento
    this.checkAuthStatus();
  }

  private hasToken(): boolean {
    return !!localStorage.getItem('jwt_token');
  }

  private checkAuthStatus(): void {
    const hasToken = this.hasToken();
    this.loggedIn.next(hasToken);
  }


  register(userData: any): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/register`, userData).pipe(
      tap(response => {
        // Dopo una registrazione riuscita, salviamo il token e reindirizziamo al login
        // per forzare l'utente a fare il login per la prima volta.
        // Questo è un pattern comune per confermare l'email in futuro.
        // NON facciamo il login automatico qui.
        console.log('Registrazione avvenuta con successo, token ricevuto.');
      })
    );
  }
  
  login(credentials: any): Observable<{ token: string }> {
  return this.http.post<{ token: string }>(`${this.apiUrl}/login`, credentials).pipe(
    tap(response => {
      console.log('AuthService.login: Risposta ricevuta:', response);
      if (response?.token) {
        console.log('AuthService.login: Salvando token in localStorage');
        localStorage.setItem('jwt_token', response.token);
        console.log('AuthService.login: Token salvato:', localStorage.getItem('jwt_token'));
        
        console.log('AuthService.login: Aggiornando BehaviorSubject a true');
        this.loggedIn.next(true);
        
        console.log('AuthService.login: Stato BehaviorSubject:', this.loggedIn.value);
      }
    })
  );
}

  logout(): void {
    localStorage.removeItem('jwt_token');
    this.loggedIn.next(false);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    // Controlla sempre il token aggiornato
    const hasToken = this.hasToken();
    // Aggiorna il BehaviorSubject se necessario
    if (this.loggedIn.value !== hasToken) {
      this.loggedIn.next(hasToken);
    }
    return hasToken;
  }

  getToken(): string | null {
    return localStorage.getItem('jwt_token');
  }
}