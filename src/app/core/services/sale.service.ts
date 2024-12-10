import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, finalize, Observable } from 'rxjs';
import { ITotalesResponse } from '../interfaces/totales.interface';
import { URL_TOTALES_ALL } from '../config/api/config.url';
import { IResponseVentasHoySemanaMes } from '../interfaces/ventas.info';

@Injectable({
	providedIn: 'root',
})
export class SaleService {
	isLoading$: Observable<boolean>;
	isLoadingSubject: BehaviorSubject<boolean>;

	constructor(private http: HttpClient) {
		this.isLoadingSubject = new BehaviorSubject<boolean>(false);
		this.isLoading$ = this.isLoadingSubject.asObservable();
	}

	getTotal(): Observable<ITotalesResponse> {
		return this.http
			.get<ITotalesResponse>(`${URL_TOTALES_ALL}`)
			.pipe(finalize(() => this.isLoadingSubject.next(false)));
	}

	geHoySemanaMes(): Observable<IResponseVentasHoySemanaMes> {
		return this.http
			.get<IResponseVentasHoySemanaMes>(`${URL_TOTALES_ALL}/consulta-mes-semana-mes`)
			.pipe(finalize(() => this.isLoadingSubject.next(true)));
	}
}
