import { CommonModule } from '@angular/common';
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
import { Category, ICategorieResponseData } from '../../../../core/interfaces/categories.interface';
import { CategoriesService } from '../../../../core/services/categories.service';
import { CrearCategorieComponent } from '../../components/crear-categorie/crear-categorie.component';
import Swal from 'sweetalert2';
import { ActualizarCategorieComponent } from '../../components/actualizar-categorie/actualizar-categorie.component';
import { ReportesExcelService } from '../../../../core/services/reports/reportes-excel.service';
import { ReportesPdfService } from '../../../../core/services/reports/reportes-pdf.service';

const NZ_MODULES = [
	NzInputModule,
	NzIconModule,
	NzButtonModule,
	NzTableModule,
	NzPaginationModule,
	NzFormModule,
	NzLayoutModule,
	NzToolTipModule,
	NzSelectModule,
	NzDropDownModule,
	NzDividerModule,
	NzCardModule,
	NzTagModule,
	NzBreadCrumbModule,
	NzToolTipModule,
];
@Component({
	selector: 'app-categoria-list',
	standalone: true,
	imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule, NZ_MODULES, NzModalModule],
	templateUrl: './categoria-list.component.html',
	styleUrl: './categoria-list.component.scss',
})
export default class CategoriaListComponent implements OnInit {
	constructor(
		private readonly _modal: NzModalService,
		private readonly _categorieService: CategoriesService,
		private readonly message: NzMessageService,
		private reportePdfService: ReportesPdfService,
		private reporteExcelService: ReportesExcelService
	) {}

	categorias: Category[] = [];
	loading = false;
	search: string = '';
	page: number = 1;
	limit: number = 10;
	total: number = 0;
	ngOnInit(): void {
		this.loadDataCategorias();
	}
	loadDataCategorias(): void {
		this.loading = true;
		this._categorieService.getCategoriesData(this.page, this.limit, this.search).subscribe({
			next: (response: ICategorieResponseData) => {
				this.categorias = response.categories;
				this.total = response.info.total;
				this.loading = false;
				console.log(response);
			},
			error: (err) => {
				console.error('Error al cargar categorias', err);
				this.loading = false;
			},
		});
	}

	descargarExcel(): void {
		this.reporteExcelService.descargarExcelCategoria().subscribe({
			next: (blob: Blob) => {
				const url = window.URL.createObjectURL(blob);
				const link = document.createElement('a');
				link.href = url;
				link.download = 'reporte_categorias.xlsx';
				link.click();
				window.URL.revokeObjectURL(url);
			},
			error: () => {
				this.message.error('Error al descargar el Excel');
			},
		});
	}

	downloadPDF(): void {
		this.reportePdfService.downloadCategoriasPDF().subscribe({
			next: (blob: Blob) => {
				const url = window.URL.createObjectURL(blob);
				const link = document.createElement('a');
				link.href = url;
				link.download = 'reporte_categorias.pdf';
				link.click();
				window.URL.revokeObjectURL(url);
			},
			error: () => {
				this.message.error('Error al descargar el PDF');
			},
		});
	}

	searchTo() {
		this.page = 1;
		this.loadDataCategorias();
	}

	onPageChange(page: number) {
		this.page = page;
		this.loadDataCategorias();
	}

	openAgregarCategoriasModal(): void {
		const modal = this._modal.create({
			nzTitle: 'Agregar Nueva Categoria',
			nzContent: CrearCategorieComponent,
			nzFooter: null,
			nzWidth: '600px',
		});

		modal.afterClose.subscribe((result: boolean) => {
			if (result) {
				this.loadDataCategorias();
			}
		});
	}
	openEditarModal(categoria: Category): void {
		const modal = this._modal.create({
			nzTitle: 'Editar Categoria',
			nzContent: ActualizarCategorieComponent,
			nzData: { id_categoria: categoria.id_categoria },
			nzFooter: null,
			nzWidth: '600px',
		});

		modal.afterClose.subscribe((result: boolean) => {
			if (result) {
				this.loadDataCategorias();
			}
		});
	}
	deleteCategorie(categorie: Category): void {
		Swal.fire({
			title: '¿Está seguro?',
			text: `Este proceso no es reversible, está a punto de eliminar su categoria , ${categorie.nombre_cat}`,
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
				'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-16 h-16 text-red-500"><path d="M3 6h18"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>',
		}).then((result) => {
			if (result.isConfirmed) {
				this.loading = true;
				this._categorieService.deleteCategorieById(categorie.id_categoria).subscribe({
					next: () => {
						this.loadDataCategorias();
						this.message.success('Categoría eliminada con éxito');
					},
					error: () => {
						this.loading = false;
						this.message.error('Error al eliminar la categoría');
					},
				});
			}
		});
	}

	refreshPage() {
		this.loadDataCategorias();
	}
}
