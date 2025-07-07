import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../models/category.model';
@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private apiUrl = 'https://e02a-2001-b07-ae5-5d6e-d8a7-7828-2873-d068.ngrok-free.app:8080/api/categories';

  constructor(private http: HttpClient) {}

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiUrl);
  }

  /**
   * NUOVO METODO AGGIUNTO
   * Invia una richiesta POST al backend per creare una nuova categoria.
   * @param categoryData Un oggetto contenente il nome della categoria. Es: { name: "Nuova Categoria" }
   * @returns Un Observable che emette la nuova categoria creata dal backend.
   */
  addCategory(categoryData: { name: string }): Observable<Category> {
    return this.http.post<Category>(this.apiUrl, categoryData);
  }
}