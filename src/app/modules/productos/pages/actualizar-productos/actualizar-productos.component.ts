/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ProductoService } from '../../../../core/services/productos.service';
import { Producto } from '../../../../core/interfaces/producto.interface';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NzMessageModule, NzMessageService } from 'ng-zorro-antd/message';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { forkJoin, Subject, takeUntil } from 'rxjs';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { CategoriesService } from '../../../../core/services/categories.service';
import { MarcasService } from '../../../../core/services/marcas.service';
import { SucursalService } from '../../../../core/services/sucursales.service';
import { TipoPropietarioService } from '../../../../core/services/tipo-propietario.service';
import { ITipoPropietarioResponse } from '../../../../core/interfaces/tipo-propietario.interface';
import { IComboBoxCategorie } from '../../../../core/interfaces/categories.interface';
import { IMarcaComboBox } from '../../../../core/interfaces/marcas.interface';
import { ISucursalComboBox } from '../../../../core/interfaces/sucursales.interface';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzSpinModule } from 'ng-zorro-antd/spin';

@Component({
	selector: 'app-actualizar-productos',
	standalone: true,
	imports: [
		NzMessageModule,
		NzSpinModule,
		NzDatePickerModule,
		ReactiveFormsModule,
		FormsModule,
		CommonModule,
		NzBreadCrumbModule,
		RouterLink,
	],
	templateUrl: './actualizar-productos.component.html',
	styleUrl: './actualizar-productos.component.scss',
})
export default class ActualizarProductosComponent implements OnInit, OnDestroy {
	private readonly _productoService = inject(ProductoService);
	private readonly _formBuilder = inject(FormBuilder);

	private readonly _categoriaService = inject(CategoriesService);
	private readonly _marcasService = inject(MarcasService);
	private readonly _sucursaleService = inject(SucursalService);
	private readonly _titosPropietarios = inject(TipoPropietarioService);

	tiposPropietarios: ITipoPropietarioResponse[] = [];
	categorias: IComboBoxCategorie[] = [];
	marcas: IMarcaComboBox[] = [];
	sucursales: ISucursalComboBox[] = [];

	producto!: Producto;
	productoForm!: FormGroup;
	loading = false;
	private destroy$ = new Subject<void>();

	constructor(
		private activatedRoute: ActivatedRoute,
		private message: NzMessageService,
		private router: Router
	) {
		this.initForm();
	}

	private initForm(): void {
		this.productoForm = this._formBuilder.group({
			nombre_producto: ['', [Validators.required]],
			descripcion: ['', [Validators.required]],
			stock: [0, [Validators.required, Validators.min(0)]],
			id_categoria: ['', [Validators.required]],
			id_marca: ['', [Validators.required]],
			precio_compra: ['', [Validators.required]],
			precio_venta: ['', [Validators.required]],
			estado_produto: ['', [Validators.required]],
			id_sucursal: ['', [Validators.required]],
			id_tipo_propietario: ['', [Validators.required]],
			is_active: [true, [Validators.required]],
			producto_img: ['', [Validators.required]],
			fecha_ingreso: [new Date()],
		});
	}

	loadData() {
		this.loading = true;
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
				this.loading = false;
			},
			error: () => {
				this.loading = false;
			},
		});
	}

	get nombreProductoControl() {
		return this.productoForm.get('nombre_producto');
	}

	get descripcionProductoControl() {
		return this.productoForm.get('descripcion');
	}

	get stockProductoControl() {
		return this.productoForm.get('stock');
	}
	get categoriaProductoControl() {
		return this.productoForm.get('id_categoria');
	}
	get marcaProductoControl() {
		return this.productoForm.get('id_marca');
	}
	get precioCompraProductoControl() {
		return this.productoForm.get('precio_compra');
	}
	get precioVentaProductoControl() {
		return this.productoForm.get('precio_venta');
	}

	get imagenProductoControl() {
		return this.productoForm.get('producto_img');
	}
	get estadoVentaProductoControl() {
		return this.productoForm.get('estado_produto');
	}

	get sucursalProductoControl() {
		return this.productoForm.get('id_sucursal');
	}
	get tipoPropietarioProductoControl() {
		return this.productoForm.get('id_tipo_propietario');
	}
	get estadoProductoControl() {
		return this.productoForm.get('is_active');
	}

	get fechaIngresoProductoControl() {
		return this.productoForm.get('fecha_ingreso');
	}

	ngOnInit(): void {
		this.activatedRoute.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
			if (params['id']) {
				this.loadProductoData(params['id']);
			}
		});
		this.loadData();
	}

	loadProductoData(id: string) {
		this.loading = true;
		this._productoService
			.getProductoById(id)
			.pipe(takeUntil(this.destroy$))
			.subscribe({
				next: (response) => {
					this.producto = response;
					this.patchFormValues();
					this.loading = false;
				},
				error: (error) => {
					this.message.error('Error al cargar el producto');
					this.loading = false;
					console.error(error);
				},
			});
	}

	private patchFormValues(): void {
		if (this.producto) {
			this.productoForm.patchValue({
				nombre_producto: this.producto.nombre_producto,
				descripcion: this.producto.descripcion,
				stock: this.producto.stock,
				id_categoria: this.producto.id_categoria,
				id_marca: this.producto.id_marca,
				precio_compra: this.producto.precio_compra,
				precio_venta: this.producto.precio_venta,
				codigo_producto: this.producto.codigo_producto,
				estado_produto: this.producto.estado_produto,
				id_sucursal: this.producto.id_sucursal,
				id_tipo_propietario: this.producto.id_tipo_propietario,
				is_active: this.producto.is_active,
				producto_img: this.producto.producto_img,
				fecha_ingreso: this.producto.fecha_ingreso,
			});
		}
	}

	onUpdateProducto(): void {
		if (this.productoForm.valid && this.producto) {
			if (!this.productoForm.dirty) {
				this.message.warning('No se han realizado cambios en el Producto');
				return;
			}

			const updatedProducto: Producto = {
				...this.producto,
				...this.productoForm.value,
			};

			this._productoService.updateProducto(updatedProducto).subscribe({
				next: () => {
					this.message.success('Producto actualizado correctamente');
					this.productoForm.reset();
				},
				error: (error) => {
					console.error('Error al actualizar el producto', error);
				},
			});
		} else {
			this.validateForm();
		}
	}

	private validateForm(): void {
		Object.values(this.productoForm.controls).forEach((control) => {
			if (control.invalid) {
				control.markAsDirty();
				control.updateValueAndValidity({ onlySelf: true });
			}
		});
	}

	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}
}
