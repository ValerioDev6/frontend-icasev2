import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ITipoPersonaCombo } from '../interfaces/tipo-persona.interface';
import { URL_TIPO_PERSONAS } from '../config/api/config.url';

@Injectable({
	providedIn: 'root',
})
export class TipoPersonaService {
	constructor(private readonly _httpClient: HttpClient) {}

	getTipoPersonaCombo(): Observable<ITipoPersonaCombo[]> {
		return this._httpClient.get<ITipoPersonaCombo[]>(URL_TIPO_PERSONAS);
	}
}
