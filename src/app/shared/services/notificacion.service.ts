import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd/message';

@Injectable({
	providedIn: 'root',
})
export class NotificationService {
	private loadingSubject = new Subject<boolean>();
	loading$ = this.loadingSubject.asObservable();

	constructor(private messageService: NzMessageService) {}

	setLoading(loading: boolean) {
		this.loadingSubject.next(loading);
	}

	showMessage(message: string): void {
		this.messageService.success(message);
	}

	showError(message: string): void {
		this.messageService.error(message);
	}

	showInfo(message: string): void {
		this.messageService.info(message);
	}

	showWarning(message: string): void {
		this.messageService.warning(message);
	}
}
