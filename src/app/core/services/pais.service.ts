import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IPaisCombo } from '../interfaces/pais.interface';
import { URL_PAIS_ALL } from '../config/api/config.url';

@Injectable({
	providedIn: 'root',
})
export class PaisService {
	constructor(private readonly _httpClient: HttpClient) {}

	getPaisesData(): Observable<IPaisCombo[]> {
		return this._httpClient.get<IPaisCombo[]>(URL_PAIS_ALL);
	}
}
