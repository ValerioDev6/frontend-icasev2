/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, delay, map, Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { IPersonalResponse } from '../interfaces/personal.interface';
import { IPersonalResponseData } from '../interfaces/persona-resposponse';
import { IPersonalSubmit } from '../interfaces/personas.interface';
import { Personal } from '../interfaces/login-response.interface';
import { IClienteByIdDetallesResponse } from '../interfaces/personal-by-id.interface';
import { ChangePasswordAdminDto } from '../interfaces/password.interface';

@Injectable({ providedIn: 'root' })
export class PersonalService {
	private readonly API_URL = `${environment.BACKEND_URL}/personal`;
	private readonly API_UR_PASSWORD = `${environment.BACKEND_URL}/auth`;

	constructor(private readonly _httpClient: HttpClient) {}

	getPersonalData(page: number, limit: number, search: string = ''): Observable<IPersonalResponse> {
		const params = new HttpParams().set('page', page.toString()).set('limit', limit.toString()).set('search', search);
		return this._httpClient.get<IPersonalResponse>(this.API_URL, { params }).pipe(delay(1000));
	}

	getPersonalById(id: string): Observable<IPersonalResponseData> {
		return this._httpClient.get<IPersonalResponseData>(`${this.API_URL}/${id}`);
	}

	getPersonalByIdDetalles(id: string): Observable<IClienteByIdDetallesResponse> {
		return this._httpClient.get<IClienteByIdDetallesResponse>(`${this.API_URL}/${id}/detalle`);
	}

	updatePersonal(data: Personal): Observable<IPersonalSubmit> {
		return this._httpClient.patch<IPersonalSubmit>(`${this.API_URL}/${data.id_personal}`, data);
	}
	createPersonal(data: IPersonalSubmit): Observable<IPersonalSubmit> {
		return this._httpClient.post<IPersonalSubmit>(`${this.API_URL}`, data);
	}

	deletePersonalById(id: string): Observable<boolean> {
		return this._httpClient.delete(`${this.API_URL}/${id}`).pipe(
			catchError(() => of(false)),
			map(() => true)
		);
	}

	// En el servicio
	changeCurrentUserPassword(changePasswordDto: ChangePasswordAdminDto): Observable<any> {
		return this._httpClient.post(`${this.API_UR_PASSWORD}/change-password`, changePasswordDto);
	}

	// Method for changing password for a specific user (admin functionality)
	changeUserPasswordById(idPersonal: string, changePasswordDto: ChangePasswordAdminDto): Observable<any> {
		return this._httpClient.post(`${this.API_UR_PASSWORD}/change-password-personal`, {
			idPersonal,
			...changePasswordDto,
		});
	}
}
