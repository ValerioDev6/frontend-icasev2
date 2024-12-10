import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { CommonModule } from '@angular/common';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { IProveedoresResponse, Proveedore, TBPersonas } from '../../../../core/interfaces/proveedores.interface';
import { ProveedoresService } from '../../../../core/services/proveedores.service';
import { CrearProveedorComponent } from '../../components/crear-proveedor/crear-proveedor.component';
import Swal from 'sweetalert2';
import { ActualziarProveedorComponent } from '../../components/actualziar-proveedor/actualziar-proveedor.component';
import { ReportesPdfService } from '../../../../core/services/reports/reportes-pdf.service';
import { ReportesExcelService } from '../../../../core/services/reports/reportes-excel.service';
const NZ_MODULES = [
	NzInputModule,
	NzIconModule,
	NzButtonModule,
	NzTableModule,
	NzPaginationModule,
	NzFormModule,
	NzLayoutModule,
	NzSelectModule,
	NzDropDownModule,
	NzDividerModule,
	NzCardModule,
	NzTagModule,
	NzBreadCrumbModule,
	NzToolTipModule,
	NzPopconfirmModule,
	NzSpaceModule,
	NzModalModule,
];
@Component({
	selector: 'app-proveedores-lista',
	standalone: true,
	imports: [NZ_MODULES, RouterModule, ReactiveFormsModule, FormsModule, CommonModule],
	templateUrl: './proveedores-lista.component.html',
	styleUrl: './proveedores-lista.component.scss',
})
export default class ProveedoresListaComponent implements OnInit {
	proveedores: Proveedore[] = [];
	loading = false;
	search: string = '';
	page: number = 1;
	limit: number = 10;
	total: number = 0;
	deletingMarcaId: string | null = null;

	constructor(
		private readonly _proveedorService: ProveedoresService,
		private readonly reportePdfService: ReportesPdfService,
		private readonly reporteExcelService: ReportesExcelService,

		private readonly _modal: NzModalService,
		private readonly message: NzMessageService
	) {}
	ngOnInit(): void {
		this.loadDataProveedor();
	}

	descargarExcel(): void {
		this.reporteExcelService.descargarExcelMarcas().subscribe({
			next: (blob: Blob) => {
				const url = window.URL.createObjectURL(blob);
				const link = document.createElement('a');
				link.href = url;
				link.download = 'reporte_marcas.xlsx';
				link.click();
				window.URL.revokeObjectURL(url);
			},
			error: (error) => {
				this.message.error('Error al descargar el Excel');
				console.error('Error downloading Excel:', error);
			},
		});
	}

	downloadPDF(): void {
		this.reportePdfService.downloadProveedoresPDF().subscribe({
			next: (blob: Blob) => {
				const url = window.URL.createObjectURL(blob);
				const link = document.createElement('a');
				link.href = url;
				link.download = 'reporte_proveedores.pdf';
				link.click();
				window.URL.revokeObjectURL(url);
			},
			error: (error) => {
				this.message.error('Error al descargar el PDF');
				console.error('Error downloading PDF:', error);
			},
		});
	}

	loadDataProveedor() {
		this.loading = true;
		this._proveedorService.getProovedoresData(this.page, this.limit, this.search).subscribe({
			next: (response: IProveedoresResponse) => {
				this.proveedores = response.proveedores;
				this.total = response.info.total;
				this.loading = false;
			},
		});
	}
	openAgregarProveedorModal() {
		const modal = this._modal.create({
			nzTitle: 'Agregar nuevo Proveedor',
			nzContent: CrearProveedorComponent,
			nzFooter: null,
		});

		modal.afterClose.subscribe((result: boolean) => {
			if (result) {
				this.loadDataProveedor();
			}
		});
	}

	openEditarModal(proveedor: Proveedore): void {
		const modal = this._modal.create({
			nzTitle: 'Editar Proveedor',
			nzContent: ActualziarProveedorComponent,
			nzData: { id_proveedor: proveedor.id_proveedor },
			nzFooter: null,
			nzWidth: '800px',
		});

		modal.afterClose.subscribe((result: boolean) => {
			if (result) {
				this.loadDataProveedor();
			}
		});
	}
	searchTo() {
		this.page = 1;
		this.loadDataProveedor();
	}

	onPageChange(page: number) {
		this.page = page;
		this.loadDataProveedor();
	}

	getColor(estado: string): string {
		switch (estado) {
			case 'Activo':
				return 'green';
			case 'Inactivo':
				return 'red';
			case 'Suspendido':
				return 'orange';
			default:
				return 'default';
		}
	}

	deleteProveedor(proveedor: Proveedore): void {
		Swal.fire({
			title: '¿Está seguro?',
			text: `Este proceso no es reversible, está a punto de eliminar su proveedor , ${proveedor.nombre_comercial}`,
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
			iconHtml:
				'<svg xmlns="http:www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-16 h-16 text-red-500"><path d="M3 6h18"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>',
		}).then((result) => {
			if (result.isConfirmed) {
				this.loading = true;
				this._proveedorService.deleteProveedorById(proveedor.id_proveedor).subscribe({
					next: () => {
						this.loadDataProveedor();
						this.message.success('Proveedor eliminado con éxito');
					},
					error: () => {
						this.loading = false;
						this.message.error('Error al eliminar el proveedor');
					},
				});
			}
		});
	}

	obtenerNombreMostrar(persona: TBPersonas): string {
		if (persona.razon_social && persona.razon_social !== 'null') {
			return persona.razon_social;
		}

		// Construir nombre completo
		const nombreCompleto = [persona.nombres, persona.apellido_paterno, persona.apellido_materno]
			.filter(Boolean)
			.join(' ')
			.trim();

		// Si nombre completo no está vacío, mostrar nombre completo
		if (nombreCompleto) {
			return nombreCompleto;
		}

		// Si todo está vacío, mostrar valor por defecto
		return 'Sin nombre';
	}
}
