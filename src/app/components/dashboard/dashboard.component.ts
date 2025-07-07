import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Transaction } from '../../core/models/transaction.model';
import { DashboardSummary } from '../../core/models/dashboard-summary.model';
import { AddTransactionComponent } from '../add-transaction/add-transaction.component';
import { TransactionService } from '../../core/services/transaction.service';
import { DashboardService } from '../../core/services/dashboard.service';
import { AuthService } from '../../core/services/auth.service'; // <-- 1. IMPORTA AuthService

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, AddTransactionComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  transactions: Transaction[] = [];
  summary: DashboardSummary | null = null;
  showAddTransactionForm: boolean = false;

  constructor(
    private transactionService: TransactionService,
    private dashboardService: DashboardService,
    private authService: AuthService // <-- 2. INIETTA AuthService NEL COSTRUTTORE
  ) {}


  // Metodo unico per caricare tutti i dati
  loadDashboardData(): void {
    this.loadTransactions();
    this.loadSummary();
  }

  // Metodo unico per caricare il riepilogo
  loadSummary(): void {
    this.dashboardService.getSummary().subscribe({
      next: (data) => this.summary = data,
      error: (err) => console.error('Errore nel caricare il riepilogo', err)
    });
  }

  // Metodo unico per caricare le transazioni
  loadTransactions(): void {
    this.transactionService.getTransactions().subscribe({
      next: (data) => this.transactions = data,
      error: (err) => console.error('Errore nel caricare le transazioni', err)
    });
  }
  

  // Metodo per mostrare/nascondere il form
  toggleAddTransactionForm(): void {
    this.showAddTransactionForm = !this.showAddTransactionForm;
  }

   ngOnInit(): void {
    this.loadDashboardData();
  }

  // Questo metodo ora semplicemente apre la modale
  openAddTransactionModal(): void {
    this.showAddTransactionForm = true;
  }

  // Questo metodo chiude la modale
  closeAddTransactionModal(): void {
    this.showAddTransactionForm = false;
  }

  // Questo viene chiamato quando una transazione è stata aggiunta con successo
  onTransactionAdded(): void {
    this.loadDashboardData(); // Ricarica i dati
    this.closeAddTransactionModal(); // Chiude la modale
  }
  // Metodo per il logout
  logout(): void {
    this.authService.logout(); // Ora this.authService esiste
  }

  // Metodo per cancellare una transazione (assicurati che sia presente solo una volta)
  deleteTransaction(id: number): void {
    if (confirm('Sei sicuro di voler eliminare questa transazione?')) {
      this.transactionService.deleteTransaction(id).subscribe({
        next: () => {
          alert('Transazione eliminata.');
          this.loadDashboardData(); // Ricarica i dati dopo l'eliminazione
        },
        error: (err) => console.error('Errore durante l\'eliminazione', err)
      });
    }
  }
}