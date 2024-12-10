/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, delay, map, Observable, of } from 'rxjs';
import { IProveedorCombo, IProveedoresResponse, Proveedore } from '../interfaces/proveedores.interface';
import { URL_PROVEEDORES_ALL } from '../config/api/config.url';
import { IProveedorByIDResponseIndividual } from '../interfaces/proveedor-by-id.interface';

@Injectable({
	providedIn: 'root',
})
export class ProveedoresService {
	constructor(private readonly _httpClient: HttpClient) {}

	getProovedoresData(page: number, limit: number, search: string = ''): Observable<IProveedoresResponse> {
		const params = new HttpParams().set('page', page.toString()).set('limit', limit.toString()).set('search', search);
		return this._httpClient.get<IProveedoresResponse>(URL_PROVEEDORES_ALL, { params }).pipe(delay(1000));
	}

	getProveedresCombo(): Observable<IProveedorCombo[]> {
		return this._httpClient.get<IProveedorCombo[]>(`${URL_PROVEEDORES_ALL}/combo`);
	}

	createProveedores(data: any): Observable<any> {
		return this._httpClient.post<any>(`${URL_PROVEEDORES_ALL}`, data);
	}
	getProveedorById(id: string): Observable<Proveedore> {
		return this._httpClient.get<Proveedore>(`${URL_PROVEEDORES_ALL}/${id}`);
	}

	getProveedorDetallesById(id: string): Observable<IProveedorByIDResponseIndividual> {
		return this._httpClient.get<IProveedorByIDResponseIndividual>(`${URL_PROVEEDORES_ALL}/${id}`);
	}

	updatePersonal(data: Proveedore): Observable<any> {
		return this._httpClient.patch<any>(`${URL_PROVEEDORES_ALL}/${data.id_proveedor}`, data);
	}
	deleteProveedorById(id: string): Observable<boolean> {
		return this._httpClient.delete(`${URL_PROVEEDORES_ALL}/${id}`).pipe(
			catchError(() => of(false)),
			map(() => true)
		);
	}
}
