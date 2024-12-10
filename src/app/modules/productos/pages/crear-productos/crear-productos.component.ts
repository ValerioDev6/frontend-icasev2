import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { CategoriesService } from '../../../../core/services/categories.service';
import { MarcasService } from '../../../../core/services/marcas.service';
import { SucursalService } from '../../../../core/services/sucursales.service';
import { TipoPropietarioService } from '../../../../core/services/tipo-propietario.service';
import { ITipoPropietarioResponse } from '../../../../core/interfaces/tipo-propietario.interface';
import { IComboBoxCategorie } from '../../../../core/interfaces/categories.interface';
import { IMarcaComboBox } from '../../../../core/interfaces/marcas.interface';
import { ISucursalComboBox } from '../../../../core/interfaces/sucursales.interface';
import { ProductoService } from '../../../../core/services/productos.service';
import { forkJoin } from 'rxjs';
import { NzMessageModule, NzMessageService } from 'ng-zorro-antd/message';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { RouterLink } from '@angular/router';

@Component({
	selector: 'app-crear-productos',
	standalone: true,
	imports: [
		ReactiveFormsModule,
		NzDatePickerModule,
		FormsModule,
		CommonModule,
		NzBreadCrumbModule,
		NzMessageModule,
		NzSpinModule,
		RouterLink,
	],
	templateUrl: './crear-productos.component.html',
	styleUrl: './crear-productos.component.scss',
})
export default class CrearProductosComponent implements OnInit {
	private readonly _productoService = inject(ProductoService);

	private readonly _categoriaService = inject(CategoriesService);
	private readonly _marcasService = inject(MarcasService);
	private readonly _sucursaleService = inject(SucursalService);
	private readonly _titosPropietarios = inject(TipoPropietarioService);
	isLoading = true;

	tiposPropietarios: ITipoPropietarioResponse[] = [];
	categorias: IComboBoxCategorie[] = [];
	marcas: IMarcaComboBox[] = [];
	sucursales: ISucursalComboBox[] = [];

	productForm: FormGroup;

	ngOnInit(): void {
		this.loadData();
	}

	constructor(
		private fb: FormBuilder,
		private message: NzMessageService
	) {
		this.productForm = this.fb.group({
			nombre_producto: ['', [Validators.required]],
			descripcion: ['', [Validators.required]],
			stock: [0, [Validators.required, Validators.min(0)]],
			id_categoria: ['', [Validators.required]],
			id_marca: ['', [Validators.required]],
			precio_compra: [0, [Validators.required, Validators.min(0)]],
			precio_venta: [0, [Validators.required, Validators.min(0)]],
			producto_img: ['', [Validators.required]],
			estado_produto: ['', [Validators.required]],
			id_sucursal: ['', [Validators.required]],
			fecha_ingreso: [new Date()],
			id_tipo_propietario: ['', [Validators.required]],
			is_active: [true, [Validators.required]],
		});
	}

	get nombreProductoControl() {
		return this.productForm.get('nombre_producto');
	}

	get descripcionProductoControl() {
		return this.productForm.get('descripcion');
	}

	get stockProductoControl() {
		return this.productForm.get('stock');
	}
	get categoriaProductoControl() {
		return this.productForm.get('id_categoria');
	}
	get marcaProductoControl() {
		return this.productForm.get('id_marca');
	}
	get precioCompraProductoControl() {
		return this.productForm.get('precio_compra');
	}
	get precioVentaProductoControl() {
		return this.productForm.get('precio_venta');
	}

	get imagenProductoControl() {
		return this.productForm.get('producto_img');
	}
	get estadoVentaProductoControl() {
		return this.productForm.get('estado_produto');
	}

	get sucursalProductoControl() {
		return this.productForm.get('id_sucursal');
	}
	get tipoPropietarioProductoControl() {
		return this.productForm.get('id_tipo_propietario');
	}
	get estadoProductoControl() {
		return this.productForm.get('is_active');
	}

	get fechaIngresoProductoControl() {
		return this.productForm.get('fecha_ingreso');
	}

	loadData() {
		this.isLoading = true;
		forkJoin({
			tiposPropietarios: this._titosPropietarios.getTipoPropietariosData(),
			marcas: this._marcasService.getComboBoxMarcasAll(),
			categorias: this._categoriaService.getComboBoxCategoriaAll(),
			sucursales: this._sucursaleService.getComboBoxSucursalesAll(),
		}).subscribe({
			next: (results) => {
				this.tiposPropietarios = results.tiposPropietarios;
				this.marcas = results.marcas;
				this.categorias = results.categorias;
				this.sucursales = results.sucursales;
				this.isLoading = false;
			},
			error: () => {
				this.isLoading = false;
			},
		});
	}

	onSubmit() {
		if (this.productForm.valid) {
			const productoData = this.productForm.value;
			this._productoService.createProducto(productoData).subscribe({
				next: () => {
					this.message.success('Producto creada exitosamente');
					this.productForm.reset();
				},
				error: (erro) => {
					this.message.error('ERRORR', erro);
				},
			});
		} else {
			this.validateForm();
		}
	}

	private validateForm(): void {
		Object.values(this.productForm.controls).forEach((control) => {
			if (control.invalid) {
				control.markAsDirty();
				control.updateValueAndValidity({ onlySelf: true });
			}
		});
	}
}
