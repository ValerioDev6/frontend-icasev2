import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ITipoViaResponse } from '../interfaces/tipo-via.interface';
import { URL_TIPO_VIA_ALL } from '../config/api/config.url';

@Injectable({
	providedIn: 'root',
})
export class TipoViaService {
	constructor(private readonly _httpClient: HttpClient) {}

	getTiposViasData(): Observable<ITipoViaResponse[]> {
		return this._httpClient.get<ITipoViaResponse[]>(URL_TIPO_VIA_ALL);
	}
}
