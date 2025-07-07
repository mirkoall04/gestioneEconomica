import { Category } from "./category.model";

export enum TransactionType {
  ENTRATA = 'ENTRATA',
  USCITA = 'USCITA'
}

export interface Transaction {
  id: number;
  amount: number;
  date: string; // Useremo stringhe nel formato 'YYYY-MM-DD'
  description: string;
  type: TransactionType;
  category: Category;
}