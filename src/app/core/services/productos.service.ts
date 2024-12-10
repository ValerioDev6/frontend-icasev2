/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, delay, map, Observable, of } from 'rxjs';
import { URL_PRODUCTOS_ALL } from '../config/api/config.url';
import {
	IProductoByIDResponse,
	IProductoResponse,
	IProductosComboResponse,
	IProductoSubmit,
	Producto,
} from '../interfaces/producto.interface';

@Injectable({
	providedIn: 'root',
})
export class ProductoService {
	constructor(private readonly _httpClient: HttpClient) {}

	getProductosData(page: number, limit: number, search: string = ''): Observable<IProductoResponse> {
		const params = new HttpParams().set('page', page.toString()).set('limit', limit.toString()).set('search', search);
		return this._httpClient.get<IProductoResponse>(URL_PRODUCTOS_ALL, { params }).pipe(delay(1000));
	}

	getProductosCombo(): Observable<IProductosComboResponse[]> {
		return this._httpClient.get<IProductosComboResponse[]>(`${URL_PRODUCTOS_ALL}/combo`);
	}

	getProductoById(id: string): Observable<Producto> {
		return this._httpClient.get<Producto>(`${URL_PRODUCTOS_ALL}/${id}`);
	}
  
	getProductoDetallesById(id: string): Observable<IProductoByIDResponse> {
		return this._httpClient.get<IProductoByIDResponse>(`${URL_PRODUCTOS_ALL}/${id}`);
	}

	createProducto(data: any): Observable<any> {
		return this._httpClient.post<any>(URL_PRODUCTOS_ALL, data);
	}

	updateProducto(data: Producto): Observable<IProductoSubmit> {
		return this._httpClient.patch<IProductoSubmit>(`${URL_PRODUCTOS_ALL}/${data.id_producto}`, data);
	}

	deleteProductoById(id: string): Observable<boolean> {
		return this._httpClient.delete(`${URL_PRODUCTOS_ALL}/${id}`).pipe(
			catchError(() => of(false)),
			map(() => true)
		);
	}
}
