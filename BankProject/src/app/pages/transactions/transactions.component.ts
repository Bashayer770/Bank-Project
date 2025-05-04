import { Component } from '@angular/core';
import { TransactionService } from '../../services/transaction.service';
import { AuthService } from '../../services/auth.service';
import { Transaction } from '../../models/TransactionsResponse';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgStyle } from '@angular/common';

@Component({
  selector: 'app-transactions',
  imports: [ReactiveFormsModule,FormsModule,NgStyle],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.css'
})
export class TransactionsComponent {

  
  constructor(transactionService: AuthService) {
    transactionService.getMyTransactions().subscribe( (response: Transaction[])=>{
      this.transactions = response;
      this.transactionType = 'all'
    })
  }
  
  transactionType: string = '';
  transactions!: Transaction[]

  ShouldShow(transaction: Transaction) {
    if(this.transactionType == 'all')
      return true;

    return this.transactionType == this.GetType(transaction)
  }

  isPositive(transaction:Transaction){
    let type = this.GetType(transaction)
    if(type == 'deposit' || type =='transferTo')
      return true

    return false;
  }

  GetType(transaction: Transaction) {
    let myUserId = this.getMyUser()
    if(transaction.type == 'transfer') {
      if(transaction.to == myUserId)
        return 'transferTo'
      
      if(transaction.from == myUserId)
        return 'transferFrom'
    }
    return transaction.type;
  }



  getAmount(transaction: Transaction): string
  {
    if(this.isPositive(transaction))
      return '+ ' + transaction.amount;
    else
      return '- ' + transaction.amount;
  }

  getType(transaction: Transaction){    
    let myUserId = this.getMyUser()
    
    if(transaction.type == 'transfer')
    {  
      if(transaction.from == myUserId)
        return 'transfered to ' + this.getUserName(transaction.to);
      
      if(transaction.to == myUserId)
        return 'transfered from ' + this.getUserName(transaction.from);
    }

    return transaction.type;
  }

  getUserName(userId: string): string{
    return 'USER-' + userId.substring(userId.length - 4, userId.length-1)
  }

  getMyUser(): string{
    return '6811bf90a5fbc8dfe6a9244e'
  }



}
