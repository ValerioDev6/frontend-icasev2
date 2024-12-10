import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';

@Injectable({
	providedIn: 'root',
})
export class ReportesExcelService {
	private readonly API_URL = environment.BACKEND_URL;

	constructor(private readonly _httpClient: HttpClient) {}

	descargarExcelMarcas(): Observable<Blob> {
		return this._httpClient.get(`${this.API_URL}/reports-excel/marcas`, {
			responseType: 'blob',
		});
	}

	descargarExcelCategoria(): Observable<Blob> {
		return this._httpClient.get(`${this.API_URL}/reports-excel/categorias`, {
			responseType: 'blob',
		});
	}

	descargarExcelProducto(): Observable<Blob> {
		return this._httpClient.get(`${this.API_URL}/reports-excel/productos`, {
			responseType: 'blob',
		});
	}

	descargarExcelCompras(): Observable<Blob> {
		return this._httpClient.get(`${this.API_URL}/reports-excel/compras`, {
			responseType: 'blob',
		});
	}

	descargarExcelVentas(): Observable<Blob> {
		return this._httpClient.get(`${this.API_URL}/reports-excel/ventas`, {
			responseType: 'blob',
		});
	}

	descargarExcelProveedores(): Observable<Blob> {
		return this._httpClient.get(`${this.API_URL}/reports-excel/proveedores`, {
			responseType: 'blob',
		});
	}
}
