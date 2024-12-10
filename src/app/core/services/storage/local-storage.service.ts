import { Injectable } from '@angular/core';
import { StorageService } from './storage';
import { KEY_STORAGE } from '../../interfaces/storage.enum';

@Injectable({
	providedIn: 'root',
})
export class LocalStorageService extends StorageService {
	constructor() {
		super(window.localStorage);
	}

	isAuthenticated(): boolean {
		const authData = this.getItem<any>(KEY_STORAGE.DATA_USER);
		return authData && authData.access_token !== null;
	}

	clearAuthData(): void {
		this.removeItem(KEY_STORAGE.DATA_USER);
	}

	updateAccessToken(token: string): void {
		const authData = this.getItem<any>(KEY_STORAGE.DATA_USER);
		if (authData) {
			authData.access_token = token;
			this.setItem(KEY_STORAGE.DATA_USER, authData);
			console.log('Access token updated in local storage.');
		}
	}
}
