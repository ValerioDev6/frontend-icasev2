import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { UploadService } from '../../../../core/services/uploads.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { Observable } from 'rxjs';

@Component({
	selector: 'app-upload-producto',
	standalone: true,
	imports: [CommonModule, NzUploadModule, NzButtonModule, NzIconModule],
	templateUrl: './upload-producto.component.html',
	styleUrl: './upload-producto.component.scss',
})
export class UploadProductoComponent {
	constructor(
		private uploadService: UploadService,
		private message: NzMessageService
	) {}

	beforeUpload = (file: NzUploadFile, fileList: NzUploadFile[]): boolean | Observable<boolean> => {
		const isCSV = file.type === 'text/csv' || file.type === 'application/vnd.ms-excel';

		const isLt10M = (file.size || 0) / 1024 / 1024 < 10;

		if (!isCSV) {
			this.message.error('Solo puedes subir archivos CSV');
			return false;
		}

		if (!isLt10M) {
			this.message.error('El archivo debe ser menor a 10MB');
			return false;
		}

		const nativeFile = file as unknown as File;
		this.uploadFile(nativeFile);

		return false;
	};

	uploadFile(file: File) {
		this.uploadService.uploadProductoExcel(file).subscribe({
			next: (response) => {
				this.message.success(`${response.count} productos insertados correctamente`);
			},
			error: (error) => {
				this.message.error('Error al subir el archivo');
				console.error(error);
			},
		});
	}
}
