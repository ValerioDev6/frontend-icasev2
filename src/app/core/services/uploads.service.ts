/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { URL_UPLOAD } from '../config/api/config.url';

@Injectable({
	providedIn: 'root',
})
export class UploadService {
	constructor(private readonly httpClient: HttpClient) {}

	uploadProductoExcel(file: File): Observable<any> {
		const formData = new FormData();
		formData.append('file', file, file.name);

		return this.httpClient.post(`${URL_UPLOAD}/productos`, formData, {
			reportProgress: true,
			observe: 'body',
		});
	}
}
