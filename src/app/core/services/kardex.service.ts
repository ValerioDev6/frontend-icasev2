import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { URL_kARDEX_ALL } from '../config/api/config.url';
import { IKardexResponse } from '../interfaces/kardex.interface';

@Injectable({
	providedIn: 'root',
})
export class KardexService {
	constructor(private readonly _httpclient: HttpClient) {}

	getKardexData(
		page: number,
		limit: number,
		startDate?: string,
		endDate?: string,
		tipoMovimiento?: 'ENTRADA' | 'SALIDA',
		tipoDocumento?: 'COMPRA' | 'VENTA'
	): Observable<IKardexResponse> {
		let params = new HttpParams().set('page', page.toString()).set('limit', limit.toString());

		if (startDate) params = params.set('fecha_inicio', startDate);
		if (endDate) params = params.set('fecha_fin', endDate);
		if (tipoMovimiento) params = params.set('tipo_movimiento', tipoMovimiento);
		if (tipoDocumento) params = params.set('tipo_documento', tipoDocumento);

		return this._httpclient.get<IKardexResponse>(URL_kARDEX_ALL, { params });
	}
	deleteKardexById(id: string): Observable<boolean> {
		return this._httpclient.delete(`${URL_kARDEX_ALL}/${id}`).pipe(
			catchError(() => of(false)),
			map(() => true)
		);
	}
}
