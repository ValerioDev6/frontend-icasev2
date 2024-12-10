/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { NotificationService } from './notificacion.service';

export interface DeletableEntity {
	id: string;
	nombre: string;
}

@Injectable({
	providedIn: 'root',
})
export class EntityDeleteService {
	constructor(private notificationService: NotificationService) {} // Inject the NotificationService

	deleteEntity<T extends DeletableEntity>(
		entity: T,
		entityName: string,
		deleteService: (id: string) => Observable<any>,
		loadData: () => void,
		setLoading: (loading: boolean) => void, // New parameter
		showMessage: (message: string) => void // New parameter
	): void {
		Swal.fire({
			title: '¿Está seguro?',
			text: `Este proceso no es reversible, está a punto de eliminar su ${entityName}, ${entity.nombre}`,
			showCancelButton: true,
			confirmButtonText: 'Sí, eliminar',
			cancelButtonText: 'No, cancelar',
			customClass: {
				popup: 'swal2-popup-custom',
				title: 'swal2-title-custom',
				htmlContainer: 'swal2-html-container-custom',
				confirmButton: 'swal2-confirm-button-custom',
				cancelButton: 'swal2-cancel-button-custom',
			},
			buttonsStyling: false,
			iconHtml: '',
		}).then((result) => {
			if (result.isConfirmed) {
				setLoading(true); // Use the new parameter
				deleteService(entity.id).subscribe({
					next: () => {
						loadData();
						showMessage(`${entityName.charAt(0).toUpperCase() + entityName.slice(1)} eliminado con éxito`); // Use the new parameter
					},
					error: () => {
						setLoading(false);
						showMessage(`Error al eliminar la ${entityName}`); // Use the new parameter
					},
				});
			}
		});
	}
}
