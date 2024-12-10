import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, delay, map, Observable, of } from 'rxjs';
import { ISucursalComboBox, ISucursaleSubmit, ISucursalResponse, Sucursale } from '../interfaces/sucursales.interface';
import { URL_SUCURSAL_ALL } from '../config/api/config.url';

@Injectable({
	providedIn: 'root',
})
export class SucursalService {
	constructor(private readonly _httpClient: HttpClient) {}

	getSucursalData(page: number, limit: number, search: string = ''): Observable<ISucursalResponse> {
		const params = new HttpParams().set('page', page.toString()).set('limit', limit.toString()).set('search', search);
		return this._httpClient.get<ISucursalResponse>(URL_SUCURSAL_ALL, { params }).pipe(delay(1000));
	}

	getComboBoxSucursalesAll(): Observable<ISucursalComboBox[]> {
		return this._httpClient.get<ISucursalComboBox[]>(`${URL_SUCURSAL_ALL}/combo`);
	}

	createSucursal(data: ISucursaleSubmit): Observable<ISucursaleSubmit> {
		return this._httpClient.post<ISucursaleSubmit>(URL_SUCURSAL_ALL, data);
	}

	getSucursalById(id: string): Observable<Sucursale> {
		return this._httpClient.get<Sucursale>(`${URL_SUCURSAL_ALL}/${id}`);
	}

	updateSucursal(data: Sucursale): Observable<ISucursaleSubmit> {
		return this._httpClient.patch<ISucursaleSubmit>(`${URL_SUCURSAL_ALL}/${data.id_sucursal}`, data);
	}

	deleteSucursal(id: string): Observable<boolean> {
		return this._httpClient.delete(`${URL_SUCURSAL_ALL}/${id}`).pipe(
			catchError(() => of(false)),
			map(() => true)
		);
	}
}
