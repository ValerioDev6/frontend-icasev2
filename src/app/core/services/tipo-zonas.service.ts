import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ITipoZonaResponse } from '../interfaces/tipo-zona.interface';
import { URL_TIPO_ZONA_ALL } from '../config/api/config.url';

@Injectable({
	providedIn: 'root',
})
export class TipoZonaService {
	constructor(private readonly _httpClient: HttpClient) {}

	getTiposZonasData(): Observable<ITipoZonaResponse[]> {
		return this._httpClient.get<ITipoZonaResponse[]>(URL_TIPO_ZONA_ALL);
	}
}
