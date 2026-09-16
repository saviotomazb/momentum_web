export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  frequency: TransactionFrequency;
  transactionDate: string;
  categoryId: string;
}

export interface CreateTransactionRequest {
  description: string;
  amount: number;
  type: TransactionType;
  frequency: TransactionFrequency;
  transactionDate: string;
  categoryId: string;
}

export interface UpdateTransactionRequest {
  description: string;
  amount: number;
  type: TransactionType;
  frequency: TransactionFrequency;
  transactionDate: string;
  categoryId: string;
}

export enum TransactionType {
  Income = 1,
  Expense = 2,
}

export enum TransactionFrequency {
  OneTime = 1,
  Recurring = 2,
}