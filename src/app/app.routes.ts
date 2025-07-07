import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { authGuard } from './core/guards/auth.guard';
import { MainLayoutComponent } from './core/layout/main-layout/main-layout.component';
import { CategoryManagementComponent } from './components/category-management/category-management.component';

export const routes: Routes = [
  // Rotte pubbliche (senza layout)
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // Rotte private (dentro il MainLayout)
  {
    path: 'app',
    component: MainLayoutComponent,
    canActivate: [authGuard], // Proteggiamo l'intero layout
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'categories', component: CategoryManagementComponent }, // <-- NUOVA ROTTA

      // { path: 'reports', component: ReportsComponent }, // Esempio per il futuro
      // { path: 'settings', component: SettingsComponent }, // Esempio per il futuro
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  
  // Rotte di default
  { path: '', redirectTo: '/app/dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' } // Se l'utente non è loggato, viene reindirizzato qui
];