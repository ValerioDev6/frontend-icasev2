import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ITipoPropietarioResponse } from '../interfaces/tipo-propietario.interface';
import { URL_TIPO_PROPIETARIO } from '../config/api/config.url';

@Injectable({
	providedIn: 'root',
})
export class TipoPropietarioService {
	constructor(private readonly httpClient: HttpClient) {}

	getTipoPropietariosData(): Observable<ITipoPropietarioResponse[]> {
		return this.httpClient.get<ITipoPropietarioResponse[]>(URL_TIPO_PROPIETARIO);
	}
}
