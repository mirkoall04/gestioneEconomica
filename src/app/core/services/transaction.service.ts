import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Transaction } from '../models/transaction.model';
import { url } from '../models/url.model';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  // private apiUrl = 'https://gestionaleeconomicobe.onrender.com/api/transactions';
  private apiUrl= url+'api/transactions'

  constructor(private http: HttpClient) {}

  getTransactions(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(this.apiUrl);
  }

  addTransaction(transactionData: any): Observable<Transaction> {
    return this.http.post<Transaction>(this.apiUrl, transactionData);
  }

  deleteTransaction(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}