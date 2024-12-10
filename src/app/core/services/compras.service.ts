/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, delay, map, Observable, of } from 'rxjs';
import { IComprasPaginationResponse } from '../interfaces/compras.interface';
import { URL_COMPRAS_ALL } from '../config/api/config.url';
import { IDetalleCompraResponse } from '../interfaces/detalle-compra.interface';
import { IComprasDetallesResponse } from '../interfaces/compras-detalles.interface';

@Injectable({
	providedIn: 'root',
})
export class ComprasService {
	constructor(private readonly _httpCliente: HttpClient) {}

	createCompra(data: any) {
		const URL = `${URL_COMPRAS_ALL}`;
		return this._httpCliente.post(URL, data);
	}

	getComprasData(page: number, limit: number, search: string = ''): Observable<IComprasPaginationResponse> {
		const params = new HttpParams().set('page', page.toString()).set('limit', limit.toString()).set('search', search);
		return this._httpCliente.get<IComprasPaginationResponse>(URL_COMPRAS_ALL, { params }).pipe(delay(600));
	}
	getComprasDetallesData(id_compra: string, page: number = 1, limit: number = 5): Observable<IComprasDetallesResponse> {
		const params = new HttpParams().set('page', page.toString()).set('limit', limit.toString());

		return this._httpCliente
			.get<IComprasDetallesResponse>(`${URL_COMPRAS_ALL}/${id_compra}/detalles`, { params })
			.pipe(delay(1000));
	}

	getCompraById(id: number): Observable<IDetalleCompraResponse | undefined> {
		return this._httpCliente.get<IDetalleCompraResponse>(`${URL_COMPRAS_ALL}/${id}`).pipe(
			catchError((error) => {
				console.error('Error al obtener la compra:', error);
				return of(undefined);
			})
		);
	}
	deleteComprasById(id: string): Observable<boolean> {
		return this._httpCliente.delete(`${URL_COMPRAS_ALL}/${id}`).pipe(
			catchError(() => of(false)),
			map(() => true)
		);
	}
}
