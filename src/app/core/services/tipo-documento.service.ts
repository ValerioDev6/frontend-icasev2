import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ITipoDocumentoCombo } from '../interfaces/tipo-documento.interface';
import { URL_TIPO_DOCUMENTO } from '../config/api/config.url';

@Injectable({
	providedIn: 'root',
})
export class TipoDocumentoService {
	constructor(private readonly _httpClient: HttpClient) {}

	getTipoDocumentoData(): Observable<ITipoDocumentoCombo[]> {
		return this._httpClient.get<ITipoDocumentoCombo[]>(URL_TIPO_DOCUMENTO);
	}
}
