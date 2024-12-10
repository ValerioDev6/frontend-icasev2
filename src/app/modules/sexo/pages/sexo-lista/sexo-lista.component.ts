import { Component, inject, OnInit } from '@angular/core';
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
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { SexoService } from '../../../../core/services/sexo.service';
import { ISexoResponse, Sexo } from '../../../../core/interfaces/sexo.interface';

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
	NzIconModule,
];
@Component({
	selector: 'app-sexo-lista',
	standalone: true,
	imports: [NZ_MODULES, CommonModule, RouterModule, ReactiveFormsModule, FormsModule, NzModalModule],
	templateUrl: './sexo-lista.component.html',
	styleUrl: './sexo-lista.component.scss',
})
export default class SexoListaComponent implements OnInit {
	private readonly _sexoService = inject(SexoService);

	constructor(
		private readonly _modal: NzModalService,
		private readonly message: NzMessageService
	) {}
	sexos: Sexo[] = [];
	loading = false;
	search: string = '';
	page: number = 1;
	limit: number = 5;
	total: number = 0;

	ngOnInit(): void {
		this.loadDataSexos();
	}

	loadDataSexos(): void {
		this.loading = true;
		this._sexoService.getSexo(this.page, this.limit, this.search).subscribe({
			next: (response: ISexoResponse) => {
				this.sexos = response.sexos;
				this.total = response.info.total;
				this.loading = false;
				console.log(response);
			},
			error: (err) => {
				console.error('Error al cargar roles', err);
				this.loading = false;
			},
		});
	}
	searchTo() {
		this.page = 1;
		this.loadDataSexos();
	}

	onPageChange(page: number) {
		this.page = page;
		this.loadDataSexos();
	}
}
