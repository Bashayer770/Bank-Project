import { Component } from '@angular/core';
import { TransactionService } from '../../services/transaction.service';
import { AuthService } from '../../services/auth.service';
import { Transaction } from '../../models/TransactionsResponse';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-transactions',
  imports: [ReactiveFormsModule,FormsModule],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.css'
})
export class TransactionsComponent {


  transactionType: string = '';

  ShouldShow(transaction: Transaction) {

    if(this.transactionType == 'All')
      return true;

    return this.transactionType == this.GetType(transaction)

}

GetType(transaction: Transaction) {
  let myUserId ='6811bf90a5fbc8dfe6a9244e'
  if(transaction.type == 'transfer') {
    if(transaction.to == myUserId)
      return 'transferTo'
    
    if(transaction.from == myUserId)
      return 'transferFrom'
  }
  return transaction.type;
}

transactions!: Transaction[]

  constructor(transactionService: AuthService) {
    transactionService.getMyTransactions().subscribe( (response: Transaction[])=>{
      console.log(response)
      this.transactions = response;
    })
  }


isPositive(transaction:Transaction){
  let type = this.GetType(transaction)
  if(type == 'deposit' || type =='transferTo')
    return true

  return false;
}


Test(transaction: Transaction) {
  return 'color: red'
  }

  getAmount(transaction: Transaction): string
  {
    let myUserId ='6811bf90a5fbc8dfe6a9244e'

    if(this.isPositive(transaction))
      return '+ ' + transaction.amount;
    else
      return '- ' + transaction.amount;
  }

  getType(transaction: Transaction){

    
    let myUserId ='6811bf90a5fbc8dfe6a9244e'

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
    return 'USER'
  }


}
