import { Component, signal, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TransferRequest } from '../../models/TransactionsRequest';
import { TransactionService } from '../../services/transaction.service';
import { User } from '../../models/Users';
import { UsersService } from '../../services/users/users.service';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ArrowsvgComponent } from '../../svg/arrowsvg/arrowsvg.component';
import { ToastComponent } from '../../components/toast/toast.component';

@Component({
  selector: 'app-transfer-link',
  imports: [CurrencyPipe, ArrowsvgComponent, ArrowsvgComponent, CommonModule],
  templateUrl: './transfer-link.component.html',
  styleUrl: './transfer-link.component.css',
})
export class TransferLinkComponent {
  toastMessage = signal<string | null>(null);
  @ViewChild(ToastComponent) toast!: ToastComponent;

  getToastMessage(): string {
    return 'test';
  }

  Confirm() {
    this.transactionService
      .transfer({
        username: <string>this.userName,
        amount: <number>this.amount,
      })
      .subscribe((response) => {
        this.showToast('Transfer Successful!', 'success');
        setTimeout(() => {
          this.router.navigate(['/home']);
        }, 3000);
      });
  }

  showToast(
    message: string,
    type: 'success' | 'error' | 'info' | 'warning'
  ): void {
    this.toastMessage.set(message);

    setTimeout(() => {
      this.toastMessage.set(null);
    }, 3000);
  }
  // ...

  Reject() {
    this.router.navigate(['/home']);
  }

  userName!: string | undefined;
  amount!: number | undefined;

  linkIsValid: boolean;

  loading: boolean;

  myUser!: User;
  otherUser!: User;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private transactionService: TransactionService,
    private userService: UsersService
  ) {
    this.linkIsValid = false;
    this.loading = true;

    this.route.queryParamMap.subscribe((params) => {
      this.userName = params.get('user')!;
      this.amount = this.convertToNumber(params.get('amount')!);

      if (this.userName == undefined) {
        this.loading = false;
      } else if (this.amount == undefined) {
        this.loading = false;
      } else {
        userService.getAllUsers().subscribe((response: User[]) => {
          let other = response.find((x) => x.username == this.userName);
          if (other) this.otherUser = other;

          if (other == undefined) {
            this.loading = false;
          } else {
            userService.getMyProfile().subscribe((myUser: User) => {
              if (myUser) this.myUser = myUser;

              if (this.myUser.username != this.otherUser.username)
                this.linkIsValid = true;

              this.loading = false;
            });
          }
        });
      }
    });
  }

  ngOnInit() {
    // this.toast .showToast("test")
  }

  convertToNumber(value: string): number | undefined {
    if (value != null && !isNaN(Number(value)) && value.trim() !== '')
      return Number(value);

    return undefined;
  }
}
