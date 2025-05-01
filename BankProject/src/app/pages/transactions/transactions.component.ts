import { Component } from '@angular/core';
import { TransactionService } from '../../services/transaction.service';

@Component({
  selector: 'app-transactions',
  imports: [],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.css'
})
export class TransactionsComponent {

  constructor(transactionService: TransactionService) {
    transactionService.getMyTransactions().subscribe(x=>console.log(x))
  }

}
