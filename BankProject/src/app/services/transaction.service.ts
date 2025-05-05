import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API } from '../services/index';
import {
  Transaction,
  TransactionResponse,
} from '../models/TransactionsResponse';
import {
  TransactionRequest,
  TransferRequest,
} from '../models/TransactionsRequest';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  constructor(private http: HttpClient) {}

  getMyTransactions(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(API.TRANSACTIONS.MY);
  }

  deposit(data: TransactionRequest): Observable<TransactionResponse> {
    return this.http.put<TransactionResponse>(API.TRANSACTIONS.DEPOSIT, data);
  }

  withdraw(data: TransactionRequest): Observable<TransactionResponse> {
    return this.http.put<TransactionResponse>(API.TRANSACTIONS.WITHDRAW, data);
  }

  transfer(data: TransferRequest): Observable<TransactionResponse> {
    return this.http.put<TransactionResponse>(
      API.TRANSACTIONS.TRANSFER + data.username,
      data
    );
  }
}
