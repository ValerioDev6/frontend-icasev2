import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from '../storage/local-storage.service';
import { BehaviorSubject, Observable, catchError, map, of, tap, throwError } from 'rxjs';
import { IResponseSingIn, Personal } from '../../interfaces/login-response.interface';
import { KEY_STORAGE, STATUS_USER } from '../../interfaces/storage.enum';
import { URL_AUTH_CHECK_STATUS, URL_AUTH_SIGNIN } from '../../config/api/config.url';
import { CheckStatusResponse } from '../../interfaces/get-status.interface';

@Injectable({
	providedIn: 'root',
})
export class AuthService {
	private _httpClient = inject(HttpClient);
	private _router = inject(Router);

	private _localStorageService = inject(LocalStorageService);
	private user = new BehaviorSubject<Personal | null>(null);
	private jwt = new BehaviorSubject<string | null>(null);

	user$ = this.user.asObservable();
	jwt$ = this.jwt.asObservable();

	constructor() {
		this.loadUserFromLocalStorage();
	}

	isLoggedIn$: Observable<boolean> = this.jwt$.pipe(map(Boolean));

	login(email: string, password: string): Observable<IResponseSingIn> {
		return this._httpClient.post<IResponseSingIn>(URL_AUTH_SIGNIN, { email, password }).pipe(
			map((response: IResponseSingIn) => {
				if (response.personal && response.personal.estado === false) {
					throw new HttpErrorResponse({
						error: { message: 'Usuario inactivo, contacte al administrador' },
						status: 401,
						statusText: 'Unauthorized',
					});
				}
				return response;
			}),
			tap((response: IResponseSingIn) => this.handleLoginResponse(response)),
			tap(() => this.redirectToDahboard()),
			catchError(this.handleError)
		);
	}

	checkAuthStatus(): Observable<CheckStatusResponse> {
		return this._httpClient.get<CheckStatusResponse>(URL_AUTH_CHECK_STATUS).pipe(
			tap((response) => {
				this._localStorageService.setItem(STATUS_USER.STATUS_USER, response.estado);
			}),
			catchError(() => {
				this.logout();
				return of(null as unknown as CheckStatusResponse);
			})
		);
	}

	logout(): void {
		this.removeStatusUserFromLocalStorage();
		this.removeUserFromLocalStorage();
		this.reditectToLogin();
	}

	private handleLoginResponse(response: IResponseSingIn): void {
		this.saveTokenToLocalStore(response);
		this.pushNewJWT(response.access_token);
		this.pushNewUser(response.personal);
	}
	private removeStatusUserFromLocalStorage(): void {
		this._localStorageService.removeItem(STATUS_USER.STATUS_USER);
	}

	private reditectToLogin(): void {
		this._router.navigateByUrl('/auth/login');
	}
	private redirectToDahboard(): void {
		this._router.navigateByUrl('/admin/dashboard');
	}

	private saveTokenToLocalStore(response: IResponseSingIn): void {
		this._localStorageService.setItem(KEY_STORAGE.DATA_USER, response);
	}

	private loadUserFromLocalStorage(): void {
		const authData = this._localStorageService.getItem<IResponseSingIn>(KEY_STORAGE.DATA_USER);
		if (authData) {
			this.pushNewJWT(authData.access_token);
			this.pushNewUser(authData.personal);
		}
	}

	private removeUserFromLocalStorage(): void {
		this._localStorageService.removeItem(KEY_STORAGE.DATA_USER);
		this.pushNewJWT(null);
		this.pushNewUser(null);
	}

	private pushNewJWT(token: string | null): void {
		this.jwt.next(token);
	}

	private pushNewUser(user: Personal | null): void {
		this.user.next(user);
	}
	private handleError(error: HttpErrorResponse) {
		let errorMessage = 'Ocurrió un error inesperado';

		if (error.error instanceof ErrorEvent) {
			errorMessage = `Error: ${error.error.message}`;
		} else {
			errorMessage = error.error.message || 'Error del servidor';
		}

		return throwError(() => new Error(errorMessage));
	}
}
