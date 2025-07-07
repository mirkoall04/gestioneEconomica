import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoryService } from '../../core/services/category.service';
import { Category } from '../../core/models/category.model';

@Component({
  selector: 'app-category-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './category-management.component.html',
  styleUrls: ['./category-management.component.scss']
})
export class CategoryManagementComponent implements OnInit {
  categories: Category[] = [];
  categoryForm: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private categoryService: CategoryService,
    private fb: FormBuilder
  ) {
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(50)]]
    });
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe(data => {
      this.categories = data;
    });
  }

  onSubmit(): void {
    if (this.categoryForm.invalid) {
      return;
    }
    this.errorMessage = null;

    this.categoryService.addCategory(this.categoryForm.value).subscribe({
      next: (newCategory) => {
        // Aggiungi la nuova categoria alla lista senza ricaricare tutto
        this.categories.push(newCategory);
        this.categoryForm.reset();
      },
      error: (err) => {
        console.error('Errore durante la creazione della categoria', err);
        if (err.status === 400) {
          this.errorMessage = 'Il nome inserito non è valido.';
        } else {
          this.errorMessage = 'Si è verificato un errore imprevisto.';
        }
      }
    });
  }
}