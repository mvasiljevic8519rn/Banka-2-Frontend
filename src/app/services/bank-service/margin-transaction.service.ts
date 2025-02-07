import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ApiRoutes } from '../api-routes';
import { MarginTransactionSendDto } from 'src/app/dtos/margin-transaction-send-dto';
import { MarginTransactionDto } from 'src/app/dtos/margin-transaction-dto';

@Injectable({
  providedIn: 'root'
})
export class MarginTransactionService {

  constructor(private httpClient: HttpClient) { }

  //GET
  getMarginsTransaction(marginTransactionSendDto :MarginTransactionSendDto) {
		return this.httpClient.get<MarginTransactionDto>(
			`${environment.bankServiceApiUrl}${ApiRoutes.marginsTransaction.getMarginsTransaction}`
		);
	}
  getAllMarginsTransactionByEmail(email:string) {
		return this.httpClient.get<MarginTransactionDto>(
			`${environment.bankServiceApiUrl}${ApiRoutes.marginsTransaction.getAllMarginsTransactionByEmail}`+'/'+email,
		);
	}
  getMarginsTransactionAccount(id: number) {
		return this.httpClient.get<MarginTransactionDto>(
			`${environment.bankServiceApiUrl}${ApiRoutes.marginsTransaction.getMarginsTransactionAccount}`+'/'+id,
		);
	}
  //POST
  postMarginsTransaction(marginTransactionDto :MarginTransactionDto) {
		return this.httpClient.post<MarginTransactionDto>(
			`${environment.bankServiceApiUrl}${ApiRoutes.marginsTransaction.postMarginsTransaction}`,
			marginTransactionDto,
		);
	}
}
