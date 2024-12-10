/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { URL_PERSONAS_ALL } from '../config/api/config.url';
import {
	ITipoPersonaClienteCombo,
	ITipoPersonaPersonalCombo,
	ITipoPersonaProveedorCombo,
} from '../interfaces/personas.interface';
import { environment } from '../../../environments/environment';

@Injectable({
	providedIn: 'root',
})
export class PersonasService {
	private RENIEC_API = environment.RENIEC_URL;
	constructor(private readonly _httpClient: HttpClient) {}

	createPersonas(data: any): Observable<any> {
		return this._httpClient.post<any>(URL_PERSONAS_ALL, data);
	}

	getPersonasByPersonal(): Observable<ITipoPersonaPersonalCombo[]> {
		return this._httpClient.get<ITipoPersonaPersonalCombo[]>(`${URL_PERSONAS_ALL}/personal`);
	}

	getPersonasByCliente(): Observable<ITipoPersonaClienteCombo[]> {
		return this._httpClient.get<ITipoPersonaClienteCombo[]>(`${URL_PERSONAS_ALL}/cliente`);
	}

	getPersonasByProveedor(): Observable<ITipoPersonaProveedorCombo[]> {
		return this._httpClient.get<ITipoPersonaProveedorCombo[]>(`${URL_PERSONAS_ALL}/proveedor`);
	}
  
}
