/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { URL_PERSONAS_ALL } from '../config/api/config.url';

@Injectable({
	providedIn: 'root',
})
export class ReniecService {
	constructor(private readonly httpClient: HttpClient) {}
	getDniInfo(dni: number): Observable<any> {
		return this.httpClient.get(`${URL_PERSONAS_ALL}/consulta/${dni}`);
	}

	getRucInfo(ruc: number): Observable<any> {
		return this.httpClient.get(`${URL_PERSONAS_ALL}/consulta-ruc/${ruc}`);
	}
}
