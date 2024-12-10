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
import { MarcasService } from '../../../../core/services/marcas.service';
import { IMarcasResponseData, Marca } from '../../../../core/interfaces/marcas.interface';
import Swal from 'sweetalert2';
import { CrearMarcaComponent } from '../../components/crear-marca/crear-marca.component';
import { UpdateMarcaComponent } from '../../components/update-marca/update-marca.component';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzSpaceModule } from 'ng-zorro-antd/space';
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
	NzPopconfirmModule,
	NzSpaceModule,
];
@Component({
	selector: 'app-marcas-lista',
	standalone: true,
	imports: [NZ_MODULES, NzToolTipModule, RouterModule, ReactiveFormsModule, FormsModule, CommonModule, NzModalModule],
	templateUrl: './marcas-lista.component.html',
	styleUrl: './marcas-lista.component.scss',
})
export default class MarcasListaComponent implements OnInit {
	marcas: Marca[] = [];
	loading = false;
	search: string = '';
	page: number = 1;
	limit: number = 10;
	total: number = 0;

	constructor(
		private readonly _marcasService: MarcasService,
		private readonly _modal: NzModalService,
		private readonly message: NzMessageService,
		private reportePdfService: ReportesPdfService,
		private reporteExcelService: ReportesExcelService
	) {}

	ngOnInit(): void {
		this.loadDataMarcas();
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
		this.reportePdfService.downloadMarcasPDF().subscribe({
			next: (blob: Blob) => {
				const url = window.URL.createObjectURL(blob);
				const link = document.createElement('a');
				link.href = url;
				link.download = 'reporte_marcas.pdf';
				link.click();
				window.URL.revokeObjectURL(url);
			},
			error: (error) => {
				this.message.error('Error al descargar el PDF');
				console.error('Error downloading PDF:', error);
			},
		});
	}
	loadDataMarcas() {
		this.loading = true;
		this._marcasService.getMarcasData(this.page, this.limit, this.search).subscribe({
			next: (response: IMarcasResponseData) => {
				this.marcas = response.marcas;
				this.total = response.info.total;
				this.loading = false;
			},
		});
	}

	searchTo() {
		this.page = 1;
		this.loadDataMarcas();
	}

	onPageChange(page: number) {
		this.page = page;
		this.loadDataMarcas();
	}

	openAgregarMarcaModal(): void {
		const modal = this._modal.create({
			nzTitle: 'Agregar Nueva Marca',
			nzContent: CrearMarcaComponent,
			nzFooter: null,
			nzWidth: '600px',
		});

		modal.afterClose.subscribe((result: boolean) => {
			if (result) {
				this.loadDataMarcas();
			}
		});
	}
	openEditarModal(marca: Marca): void {
		const modal = this._modal.create({
			nzTitle: 'Editar Marca',
			nzContent: UpdateMarcaComponent,
			nzData: { id_marca: marca.id_marca },
			nzFooter: null,
			nzWidth: '600px',
		});

		modal.afterClose.subscribe((result: boolean) => {
			if (result) {
				this.loadDataMarcas();
			}
		});
	}

	deleteMarca(marca: Marca) {
		Swal.fire({
			title: '¿Está seguro?',
			text: `Este proceso no es reversible, está a punto de eliminar su marca , ${marca.nombre_marca}`,
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
				this._marcasService.deleteMarcaById(marca.id_marca).subscribe({
					next: () => {
						this.loadDataMarcas();
						this.message.success('Marca eliminada con éxito');
					},
					error: () => {
						this.loading = false;
						this.message.error('Error al eliminar la Marca');
					},
				});
			}
		});
	}

	refreshPage() {
		this.loadDataMarcas();
	}
}
