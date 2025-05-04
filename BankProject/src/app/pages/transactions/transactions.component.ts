import { Component } from '@angular/core';
import { TransactionService } from '../../services/transaction.service';
import { AuthService } from '../../services/auth.service';
import { Transaction } from '../../models/TransactionsResponse';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UsersService } from '../../services/users/users.service';
import { async, forkJoin, map, Observable } from 'rxjs';
import { User } from '../../models/Users';
import { AsyncPipe,CommonModule } from '@angular/common';

@Component({
  selector: 'app-transactions',
  imports: [ReactiveFormsModule, FormsModule, AsyncPipe,CommonModule],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.css',
})
export class TransactionsComponent {

  constructor(private transactionService: TransactionService, private userService: UsersService) {
    this.transactionService
      .getMyTransactions()
      .subscribe((response: Transaction[]) => {
        this.transactions = response;
        this.transactionType = 'all';

        console.log('test')
        this.enrichedTransactions$ = forkJoin(
          this.transactions.map(tx =>
            forkJoin({
              fromUser: this.userService.getUserbyID(tx.from),
              toUser: this.userService.getUserbyID(tx.to)
            }).pipe(
              map(users => ({
                ...tx,
                fromUsername: users.fromUser?.username ?? 'Unknown',
                toUsername: users.toUser?.username ?? 'Unknown'
              }))
            )
          )
        );
      });
  }

  transactionType: string = '';
  transactions!: Transaction[];

  enrichedTransactions$!: Observable<EnrichedTransaction[]>;

  lookupTable = {};

  ShouldShow(transaction: EnrichedTransaction) {
    if (this.transactionType == 'all') return true;

    return this.transactionType == this.GetType(transaction);
  }

  isPositive(transaction: EnrichedTransaction) {
    let type = this.GetType(transaction);
    if (type == 'deposit' || type == 'transferTo') return true;

    return false;
  }

  GetType(transaction: EnrichedTransaction) {
    let myUserId = this.getMyUser();
    if (transaction.type == 'transfer') {
      if (transaction.to == myUserId) return 'transferTo';

      if (transaction.from == myUserId) return 'transferFrom';
    }
    return transaction.type;
  }

  getAmount(transaction: EnrichedTransaction): string {
    if (this.isPositive(transaction)) return '+ ' + transaction.amount;
    else return '- ' + transaction.amount;
  }

  getType(transaction: EnrichedTransaction) {
    let myUserId = this.getMyUser();

    if (transaction.type == 'transfer') {
      if (transaction.from == myUserId)
        return 'transfered to ' + transaction.toUsername

      if (transaction.to == myUserId)
        return 'transfered from ' + transaction.fromUsername
    }

    return transaction.type;
  }

  GetUserName(input: string): Observable<User | undefined> {
    return this.userService.getUserbyID(input);
  }

  getMyUser(): string {
    return '6811bf90a5fbc8dfe6a9244e';
  }



  
}

interface EnrichedTransaction extends Transaction {
  fromUsername: string;
  toUsername: string;
}

