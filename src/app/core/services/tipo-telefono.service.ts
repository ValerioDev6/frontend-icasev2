import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ITelefonoCombo } from '../interfaces/tipo-telefono.inteface';
import { URL_TIPO_TELEFONO_ALL } from '../config/api/config.url';

@Injectable({
	providedIn: 'root',
})
export class TipoTelefonoService {
	constructor(private readonly _httpClient: HttpClient) {}
	getTiposTelefonosData(): Observable<ITelefonoCombo[]> {
		return this._httpClient.get<ITelefonoCombo[]>(URL_TIPO_TELEFONO_ALL);
	}
}
