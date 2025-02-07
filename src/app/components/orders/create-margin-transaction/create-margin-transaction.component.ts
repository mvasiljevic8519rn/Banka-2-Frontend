import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { tap, catchError, of, finalize } from 'rxjs';
import { FrontendOfferDto } from 'src/app/dtos/frontend-offer-dto';
import { BankOtcService } from 'src/app/services/otc-service/bank-otc.service';
import { OrderDto } from 'src/app/dtos/order-dto'; // Ensure you have the correct import for OrderDto
import { MarginTransactionService } from 'src/app/services/bank-service/margin-transaction.service';
import { MarginAccountsService } from 'src/app/services/bank-service/margin-accounts.service';
import { MarginTransactionDto } from 'src/app/dtos/margin-transaction-dto';
import { digitValidator } from 'src/app/utils/validators/digit.validator';

@Component({
  selector: 'app-create-margin-transaction',
  templateUrl: './create-margin-transaction.component.html',
  styleUrls: ['./create-margin-transaction.component.css']
})
export class CreateMarginTransactionComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private marginTransactionService: MarginTransactionService,
    private marginAccountsService: MarginAccountsService,

    public dialogRef: MatDialogRef<CreateMarginTransactionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { order: OrderDto } // Specify the type of the injected data
  ) {
    this.form = this.fb.group({
      description: ['', Validators.required],
      initialMargin: [null, [Validators.required, digitValidator()]],
      maintenanceMargin: [null, [Validators.required, digitValidator()]],
   
    });
  }

  createOrder(): void {
    if (this.form.valid) {
        // Extract the listing type from the injected data
        const listingType = this.data.order.listingType;
        const email = localStorage.getItem("email");
        const orderId = this.data.order.id;
        // Print the listing type to the console
        //console.log('Listing Type:', listingType);

        if (email != null) {
            this.marginAccountsService.getAllByEmail(email).subscribe(response => {
                console.log(response);

                // Find the first element in the response with the same listing type
                const matchedItem = response.find((item: any) => item.type === listingType);

                if (matchedItem) {
                  const marginAccountId=matchedItem.id as unknown as number;
                  const userId = localStorage.getItem("id") as unknown as number;
                  
                  const marginTransactionDto: MarginTransactionDto = {
                    orderId: orderId,
                    userId: Number(userId),
                    marginsAccountId: marginAccountId,
                    description: this.form.get('description')?.value,
                    currencyCode: 'RSD',
                    type: 'DEPOSIT',
                    initialMargin: Number(this.form.get('initialMargin')?.value),
                    maintenanceMargin: Number(this.form.get('maintenanceMargin')?.value),
                  };
                  

                    this.marginTransactionService
                      .postMarginsTransaction(marginTransactionDto)
                      .subscribe({
                        next: response => {
                          console.log(response);
                        },
                        error: error => {
                          console.error(error);
                        },
                      });


                    console.log(marginTransactionDto);
                } else {
                    console.log('No matching item found for the listing type:', listingType);
                }
            });
        }

        // const frontendOfferDto: FrontendOfferDto = {
        //   ticker: this.form.get('ticker')?.value,
        //   amount: this.form.get('amount')?.value,
        //   price: this.form.get('price')?.value,
        // };

        // this.otcService
        //   .postMakeOffer(frontendOfferDto)
        //   .pipe(
        //     tap(response => {
        //       console.log(response);
        //       this.dialogRef.close(response); // Close the dialog with the response
        //     }),
        //     catchError(error => {
        //       console.error(error);
        //       return of(null);
        //     }),
        //     finalize(() => {})
        //   )
        //   .subscribe();
    }
}

}
