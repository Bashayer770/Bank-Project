import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TransferRequest } from '../../models/TransactionsRequest';
import { TransactionService } from '../../services/transaction.service';

@Component({
  selector: 'app-transfer-link',
  imports: [],
  templateUrl: './transfer-link.component.html',
  styleUrl: './transfer-link.component.css'
})
export class TransferLinkComponent {


  Confirm() {
    this.transactionService.transfer({username: <string>this.userId, amount: <number>this.amount})
  }

  Reject() {
    console.log('test')
    this.router.navigate(['/home']);
  }

  userId!: string|undefined;
  amount!: number|undefined;

  linkIsValid: boolean



  constructor(private route: ActivatedRoute, private router: Router, private transactionService: TransactionService) {

    this.linkIsValid = false;

    this.route.queryParamMap.subscribe(params => {
      this.userId = params.get('user')!;
      this.amount = this.convertToNumber(params.get('amount')!);
      console.log(this.userId)
      console.log(this.amount)

      if(this.userId == undefined)
        console.log('userId undefined')
      else if(this.amount == undefined)
        console.log('amount undefined')
      else{
        this.linkIsValid = true;
        console.log('valid link')
        console.log(`Would you like to transfer ${this.amount} KD to ${this.userId}?`)
      }      
    });
  }

  convertToNumber(value: string): number | undefined {    
    if(value != null && !isNaN(Number(value)) && value.trim() !== '') 
        return Number(value);
    
    return undefined;
  }

}
