import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent {
 private activeComponent: any;
  currentUrl: string = '';
  public isSidebarOpen = false;

  constructor(private authService: AuthService, private router: Router) {
    // Ascolta i cambiamenti di rotta per sapere sempre dove ci troviamo
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.currentUrl = event.urlAfterRedirects;
    });
  }
  
  // Metodi per controllare la pagina attiva e mostrare il titolo corretto
  isDashboardActive(): boolean {
    return this.currentUrl.includes('/app/dashboard');
  }

  isCategoriesActive(): boolean {
    return this.currentUrl.includes('/app/categories');
  }

  isReportsActive(): boolean {
    return this.currentUrl.includes('/app/reports');
  }

  isSettingsActive(): boolean {
    return this.currentUrl.includes('/app/settings');
  }

  // Metodo per aprire/chiudere la sidebar
  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  // Miglioramento: chiude la sidebar quando si clicca un link su mobile
  closeSidebarOnMobile(): void {
    if (window.innerWidth <= 768) {
      this.isSidebarOpen = false;
    }
  }

  // Cattura l'istanza del componente caricato nel router-outlet
  onOutletActivated(component: any) {
    this.activeComponent = component;
  }

  // Chiama il metodo del componente figlio quando si clicca il '+'
  onAddTransactionClick(): void {
    if (this.activeComponent && typeof this.activeComponent.openAddTransactionModal === 'function') {
      this.activeComponent.openAddTransactionModal();
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}