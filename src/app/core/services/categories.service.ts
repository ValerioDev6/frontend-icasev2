import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
	Category,
	ICategorieResponseData,
	ICategorySubmit,
	IComboBoxCategorie,
} from '../interfaces/categories.interface';
import { catchError, delay, map, Observable, of } from 'rxjs';
import { URL_CATEGORIAS } from '../config/api/config.url';

@Injectable({
	providedIn: 'root',
})
export class CategoriesService {
	constructor(private readonly _httpClient: HttpClient) {}

	getCategoriesData(page: number, limit: number, search: string = ''): Observable<ICategorieResponseData> {
		const params = new HttpParams().set('page', page.toString()).set('limit', limit.toString()).set('search', search);
		return this._httpClient.get<ICategorieResponseData>(URL_CATEGORIAS, { params }).pipe(delay(1000));
	}

	getComboBoxCategoriaAll(): Observable<IComboBoxCategorie[]> {
		return this._httpClient.get<IComboBoxCategorie[]>(`${URL_CATEGORIAS}/combo`);
	}

	createCategorias(data: ICategorySubmit): Observable<ICategorySubmit> {
		return this._httpClient.post<ICategorySubmit>(URL_CATEGORIAS, data);
	}

	getCategoriasById(id: string): Observable<Category> {
		return this._httpClient.get<Category>(`${URL_CATEGORIAS}/${id}`);
	}

	updateMarca(data: Category): Observable<ICategorySubmit> {
		return this._httpClient.patch<ICategorySubmit>(`${URL_CATEGORIAS}/${data.id_categoria}`, data);
	}

	deleteCategorieById(id: string): Observable<boolean> {
		return this._httpClient.delete(`${URL_CATEGORIAS}/${id}`).pipe(
			catchError(() => of(false)),
			map(() => true)
		);
	}
}
