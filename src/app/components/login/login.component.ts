import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
 loginForm: FormGroup;
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    // Se l'utente è già loggato, reindirizza alla dashboard
    if (this.authService.isLoggedIn()) {
      console.log('LoginComponent: Utente già loggato, reindirizzamento alla dashboard');
      this.router.navigate(['/app/dashboard']);
    }
  }

  onSubmit(): void {
    console.log('onSubmit è stato chiamato!');
    
    if (this.loginForm.valid) {
      console.log('Il form è valido. Sto chiamando authService.login...');
      this.isLoading = true;
      this.errorMessage = '';

      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          console.log('Login riuscito! Risposta dal backend:', response);
          console.log('Token salvato in localStorage:', localStorage.getItem('jwt_token'));
          console.log('AuthService.isLoggedIn():', this.authService.isLoggedIn());
          
          // Controlla lo stato dell'AuthService
          this.authService.isLoggedIn$.subscribe(isLoggedIn => {
            console.log('BehaviorSubject isLoggedIn$:', isLoggedIn);
          });

          console.log('Navigando verso /app/dashboard...');
          this.router.navigate(['/app/dashboard']).then(success => {
            console.log('Navigazione riuscita?', success);
          }).catch(error => {
            console.error('Errore nella navigazione:', error);
          });
        },
        error: (error) => {
          console.error('Errore durante il login:', error);
          this.errorMessage = 'Credenziali non valide. Riprova.';
          this.isLoading = false;
        }
      });
    } else {
      console.log('Il form non è valido');
      this.errorMessage = 'Compila tutti i campi obbligatori.';
    }
  }
}