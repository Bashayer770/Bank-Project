import { Component } from '@angular/core';
import { TransactionService } from '../../services/transaction.service';
import { Transaction } from '../../models/TransactionsResponse';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UsersService } from '../../services/users/users.service';
import { User } from '../../models/Users';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-transactions',
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.css',
})
export class TransactionsComponent {
  firstDate: string = new Date(2024, 0, 2).toISOString().split('T')[0];
  todaysDate: string = new Date().toISOString().split('T')[0];
  allUsers!: User[];

  transactionTypes: string[] = [
    'all',
    'withdraw',
    'deposit',
    'transferFrom',
    'transferTo',
  ];

  constructor(
    private transactionService: TransactionService,
    private userService: UsersService
  ) {
    this.userService.getAllUsers().subscribe((response) => {
      this.allUsers = response;
      this.transactionService
        .getMyTransactions()
        .subscribe((response: Transaction[]) => {
          this.transactions = response;
          this.transactionType = 'all';
        });
    });
  }

  transactionType: string = '';
  transactions!: Transaction[];
  myUser: string = '';
  lookupTable = {};

  ShouldShow(transaction: Transaction) {
    if (this.transactionType == 'all') return true;

    return this.transactionType == this.GetType(transaction);
  }

  isPositive(transaction: Transaction) {
    let type = this.GetType(transaction);
    if (type == 'deposit' || type == 'transferTo') return true;

    return false;
  }

  GetType(transaction: Transaction) {
    let myUserId = this.getMyUser();
    if (transaction.type == 'transfer') {
      if (transaction.to == myUserId) return 'transferTo';

      if (transaction.from == myUserId) return 'transferFrom';
    }
    return transaction.type;
  }

  getAmount(transaction: Transaction): string {
    if (this.isPositive(transaction)) return '+ ' + transaction.amount;
    else return '- ' + transaction.amount;
  }

  getType(transaction: Transaction) {
    let myUserId = this.getMyUser();

    if (transaction.type != 'transfer') return transaction.type;

    if (transaction.from == myUserId)
      return 'Transfer to ' + this.getUserName(transaction.to);

    if (transaction.to == myUserId)
      return 'Transfer from ' + this.getUserName(transaction.from);

    return '';
  }

  getUserName(id: string): string {
    let user = this.getUser(id);
    if (user) return user.username;
    else return 'Unknown';
  }

  getUser(id: string): User | undefined {
    return this.allUsers.find((x) => x._id == id);
  }

  getMyUser(): string {
    let user = this.userService.getMyCachedProfile();
    if (user) return user._id;
    else return 'Unknown';
  }

  GetRadioString(name: string): string {
    //This should be a pipe
    switch (name) {
      case 'all':
        return 'All';
      case 'deposit':
        return 'Deposit';
      case 'withdraw':
        return 'Withdraw';
      case 'transferFrom':
        return 'Transfer From';
      case 'transferTo':
        return 'Transfer To';
    }
    return '';
  }
}
