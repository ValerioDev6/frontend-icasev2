import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, delay, map, Observable, of } from 'rxjs';
import { IRolCombo, IRolesResponse, IRoleSubmit, Role } from '../interfaces/roles.interface';
import { URL_ROLES_ALL } from '../config/api/config.url';

@Injectable({
	providedIn: 'root',
})
export class RolesService {
	constructor(private readonly _httpClient: HttpClient) {}

	getRolesData(page: number, limit: number, search: string = ''): Observable<IRolesResponse> {
		const params = new HttpParams().set('page', page.toString()).set('limit', limit.toString()).set('search', search);
		return this._httpClient.get<IRolesResponse>(URL_ROLES_ALL, { params }).pipe(delay(1000));
	}

	getRolesCombo(): Observable<IRolCombo[]> {
		return this._httpClient.get<IRolCombo[]>(`${URL_ROLES_ALL}/combo`);
	}

	createRoles(data: IRoleSubmit): Observable<IRoleSubmit> {
		return this._httpClient.post<IRoleSubmit>(URL_ROLES_ALL, data);
	}

	getRoleById(id: string): Observable<Role> {
		return this._httpClient.get<Role>(`${URL_ROLES_ALL}/${id}`);
	}

	updateRole(data: Role): Observable<IRoleSubmit> {
		return this._httpClient.patch<IRoleSubmit>(`${URL_ROLES_ALL}/${data.id_rol}`, data);
	}

	deleteRole(id: string): Observable<boolean> {
		return this._httpClient.delete(`${URL_ROLES_ALL}/${id}`).pipe(
			catchError(() => of(false)),
			map(() => true)
		);
	}
}
