import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.authService.register(this.registerForm.value).subscribe({
        next: () => {
          alert('Registrazione avvenuta con successo! Ora puoi effettuare il login.');
          this.router.navigate(['/login']);
        },
        error: (err: HttpErrorResponse) => { // <-- 2. AGGIUNGI IL TIPO QUI
          console.error('Errore durante la registrazione', err);
          this.errorMessage = 'Errore durante la registrazione.';
          if (err.status === 409) {
             this.errorMessage = 'Username o email già esistenti.';
          } else if (err.status === 400) {
             // Qui potremmo leggere il corpo dell'errore per un messaggio più specifico
             this.errorMessage = 'Dati invalidi. Controlla che tutti i campi siano corretti.';
          }
        }
      });
    }
  }
}