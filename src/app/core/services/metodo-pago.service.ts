import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IMetodoPagoCombo } from '../interfaces/metodos-pago.interface';
import { URL_METODOS_PAGOS } from '../config/api/config.url';

@Injectable({
	providedIn: 'root',
})
export class MetodoPagoService {
	constructor(private readonly _httpClient: HttpClient) {}

	metodoPagoCombo(): Observable<IMetodoPagoCombo[]> {
		return this._httpClient.get<IMetodoPagoCombo[]>(URL_METODOS_PAGOS);
	}
}
