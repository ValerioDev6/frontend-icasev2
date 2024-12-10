import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IComboBoxDireccion, IDireccionResponse } from '../interfaces/direcciones.interface';
import { URL_DIRECCION_ALL } from '../config/api/config.url';
import { delay, Observable } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class DireccionService {
	constructor(private readonly _httpClient: HttpClient) {}

	getDireccionData(page: number, limit: number, search: string = ''): Observable<IDireccionResponse> {
		const params = new HttpParams().set('page', page.toString()).set('limit', limit.toString()).set('search', search);
		return this._httpClient.get<IDireccionResponse>(URL_DIRECCION_ALL, { params }).pipe(delay(1000));
	}

	getComboBoxDireccionesAll(): Observable<IComboBoxDireccion[]> {
		return this._httpClient.get<IComboBoxDireccion[]>(`${URL_DIRECCION_ALL}/combo`);
	}
}
