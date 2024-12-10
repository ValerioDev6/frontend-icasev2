import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { delay, Observable } from 'rxjs';
import { IGenerosCombo, ISexoResponse } from '../interfaces/sexo.interface';
import { URL_SEXO_ALL } from '../config/api/config.url';

@Injectable({
	providedIn: 'root',
})
export class SexoService {
	constructor(private readonly _httpClient: HttpClient) {}

	getSexo(page: number, limit: number, search: string = ''): Observable<ISexoResponse> {
		const params = new HttpParams().set('page', page.toString()).set('limit', limit.toString()).set('search', search);
		return this._httpClient.get<ISexoResponse>(URL_SEXO_ALL, { params }).pipe(delay(1000));
	}

	getGenerosCombo(): Observable<IGenerosCombo[]> {
		return this._httpClient.get<IGenerosCombo[]>(`${URL_SEXO_ALL}/combo`);
	}
}
