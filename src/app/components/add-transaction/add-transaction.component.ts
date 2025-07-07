import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Category } from '../../core/models/category.model';
import { TransactionType } from '../../core/models/transaction.model';
import { CategoryService } from '../../core/services/category.service';
import { TransactionService } from '../../core/services/transaction.service';

@Component({
  selector: 'app-add-transaction',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-transaction.component.html',
  styleUrls: ['./add-transaction.component.scss']
})
export class AddTransactionComponent implements OnInit {
  @Output() transactionAdded = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>(); // <-- NUOVO EVENTO DI OUTPUT

  transactionForm: FormGroup;
  categories: Category[] = [];
  transactionTypes = Object.values(TransactionType);
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private transactionService: TransactionService
  ) {
    this.transactionForm = this.fb.group({
      amount: ['', [Validators.required, Validators.min(0.01)]],
      date: ['', Validators.required],
      description: ['', Validators.required],
      type: [TransactionType.USCITA, Validators.required],
      categoryId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe(cats => this.categories = cats);
  }

  onSubmit(): void {
    if (this.transactionForm.invalid) {
      return;
    }

    this.transactionService.addTransaction(this.transactionForm.value).subscribe({
      next: () => {
        alert('Transazione aggiunta con successo!');
        this.transactionAdded.emit(); // Notifica il parent che la transazione è stata aggiunta
      },
      error: (err) => {
        console.error('Errore aggiunta transazione', err);
        this.errorMessage = 'Impossibile aggiungere la transazione.';
      }
    });
  }

  // Metodo per chiudere la modale
  closeModal(): void {
    this.close.emit();
  }
}