import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TransferRequest } from '../../models/TransactionsRequest';
import { TransactionService } from '../../services/transaction.service';
import { User } from '../../models/Users';
import { UsersService } from '../../services/users/users.service';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ArrowsvgComponent } from '../../svg/arrowsvg/arrowsvg.component';
import { ToastComponent } from '../../components/toast/toast.component';
import { LeftArrowComponent } from '../../svg/left-arrow/left-arrow.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-transfer-link',
  imports: [
    CurrencyPipe,
    ArrowsvgComponent,
    CommonModule,
    ToastComponent,
    LeftArrowComponent,
  ],
  templateUrl: './transfer-link.component.html',
  styleUrl: './transfer-link.component.css',
})
export class TransferLinkComponent {
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
        console.log(response);
        this.toast.showToast('Transfer Successful!');

        setTimeout(() => {
          this.router.navigate(['/home']);
        }, 1500); // 1.5 seconds delay so the toast can appear
      });
  }

  Reject() {
    console.log('test');
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
    private userService: UsersService,
    private authService: AuthService
  ) {
    this.linkIsValid = false;
    this.loading = true;

    this.route.queryParamMap.subscribe((params) => {
      this.userName = params.get('user')!;
      this.amount = this.convertToNumber(params.get('amount')!);

      console.log(this.userName);
      console.log(this.amount);

      if (this.userName == undefined) {
        console.log('userName undefined');
        this.loading = false;
      } else if (this.amount == undefined) {
        console.log('amount undefined');
        this.loading = false;
      } else if (!sessionStorage.getItem('token')) {
        console.log('not logged in, redirecting');
        this.router.navigate(['/auth'], {
          queryParams: { user: this.userName, amount: this.amount },
        }); // with query param
      } else {
        console.log('valid link');
        console.log(
          `Would you like to transfer ${this.amount} KD to ${this.userName}?`
        );

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
