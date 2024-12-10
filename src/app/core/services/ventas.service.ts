/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, delay, map, Observable, of } from 'rxjs';
import { IVentasResponse } from '../interfaces/ventas.interface';
import { URL_VENTAS_ALL } from '../config/api/config.url';
import { IVentasDetallesResponse } from '../interfaces/ventas-detalle.interface';
import { IDetalleVentaResponseByID } from '../interfaces/detalle-venta.interface';

@Injectable({
	providedIn: 'root',
})
export class VentasService {
	constructor(private readonly http: HttpClient) {}
	createVenta(data: any) {
		const URL = `${URL_VENTAS_ALL}`;
		return this.http.post(URL, data);
	}

	getVentasData(page: number, limit: number, search: string = ''): Observable<IVentasResponse> {
		const params = new HttpParams().set('page', page.toString()).set('limit', limit.toString()).set('search', search);
		return this.http.get<IVentasResponse>(URL_VENTAS_ALL, { params }).pipe(delay(600));
	}

	deleteVentasById(id: string): Observable<boolean> {
		return this.http.delete(`${URL_VENTAS_ALL}/${id}`).pipe(
			catchError(() => of(false)),
			map(() => true)
		);
	}

	getVentasDetallesData(id_venta: string, page: number = 1, limit: number = 5): Observable<IVentasDetallesResponse> {
		const params = new HttpParams().set('page', page.toString()).set('limit', limit.toString());

		return this.http
			.get<IVentasDetallesResponse>(`${URL_VENTAS_ALL}/${id_venta}/detalles`, { params })
			.pipe(delay(1000));
	}
  
	getVentaById(id: number): Observable<IDetalleVentaResponseByID | undefined> {
		return this.http.get<IDetalleVentaResponseByID>(`${URL_VENTAS_ALL}/${id}`).pipe(
			catchError((error) => {
				console.error('Error al obtener la venta:', error);
				return of(undefined);
			})
		);
	}
	deleteVentaById(id: string): Observable<boolean> {
		return this.http.delete(`${URL_VENTAS_ALL}/${id}`).pipe(
			catchError(() => of(false)),
			map(() => true)
		);
	}
}
