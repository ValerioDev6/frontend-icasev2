/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalService } from 'ng-zorro-antd/modal';
import { CommonModule } from '@angular/common';
import { NzTableModule } from 'ng-zorro-antd/table';
import { MetodoPagoService } from '../../../../core/services/metodo-pago.service';
import { ProveedoresService } from '../../../../core/services/proveedores.service';
import { IProveedorCombo } from '../../../../core/interfaces/proveedores.interface';
import { IMetodoPagoCombo } from '../../../../core/interfaces/metodos-pago.interface';
import { forkJoin } from 'rxjs';
import { IProductosComboResponse } from '../../../../core/interfaces/producto.interface';
import { ProductoService } from '../../../../core/services/productos.service';
import { IComboBoxCategorie } from '../../../../core/interfaces/categories.interface';
import { CategoriesService } from '../../../../core/services/categories.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ComprasService } from '../../../../core/services/compras.service';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
interface DetalleProducto {
	id_producto: string;
	categoria: string;
	producto: string;
	marca: string;
	precio_venta: number;
	cantidad: number;
	total: number;
}

interface RequestDetalleCompraDto {
	id_producto: string;
	id_categoria: string;
	cantidad: number;
	precio_unitario: number;
}

interface RequestCompraDto {
	proveedor_id: string;
	proveedor_ruc: string;
	proveedor_correo: string;
	id_metodo_pago: string;
	numero_documento: string;
	compra_comentario?: string;
	detalles: RequestDetalleCompraDto[];
}

@Component({
	selector: 'app-crear-compra',
	standalone: true,
	imports: [FormsModule, NzIconModule, CommonModule, NzTableModule, ReactiveFormsModule, NzBreadCrumbModule],
	templateUrl: './crear-compra.component.html',
	styleUrl: './crear-compra.component.scss',
	providers: [NzModalService],
})
export default class CrearCompraComponent implements OnInit {
	compraForm!: FormGroup;
	proveedores: IProveedorCombo[] = [];

	metodosPago: IMetodoPagoCombo[] = [];
	productos: IProductosComboResponse[] = [];
	categorias: IComboBoxCategorie[] = [];
	detalleProductos: DetalleProducto[] = [];

	cantidad: number = 1;
	subtotal: number = 0;
	igv: number = 0;
	total: number = 0;

	proveedorSeleccionado = {
		ruc: '',
		direccion: '',
		telefono: '',
		correo: '',
	};

	productoSelecionado = {
		precio_venta: '',
		stock: 0,
	};

	constructor(
		private readonly _compraService: ComprasService,
		private readonly _proveedoresService: ProveedoresService,
		private readonly _productosService: ProductoService,
		private readonly _categoriaSerivce: CategoriesService,
		private readonly _metodosPagos: MetodoPagoService,
		private readonly _fb: FormBuilder,
		private readonly _message: NzMessageService
	) {}

	ngOnInit() {
		forkJoin({
			categorias: this._categoriaSerivce.getComboBoxCategoriaAll(),
			proveedores: this._proveedoresService.getProveedresCombo(),
			productos: this._productosService.getProductosCombo(),
			metodosPago: this._metodosPagos.metodoPagoCombo(),
		}).subscribe({
			next: (response) => {
				this.proveedores = response.proveedores;
				this.productos = response.productos;
				this.categorias = response.categorias;
				this.metodosPago = response.metodosPago;
			},
			error: (error) => console.error('Error cargando datos:', error),
		});

		this.initForm();
	}

	onMetodoPagoChange(event: any) {
		const metodoPagoId = event.target.value;
		this.compraForm.patchValue({ metodoPago: metodoPagoId });
	}

	private initForm() {
		this.compraForm = this._fb.group({
			proveedor: ['', [Validators.required]],
			metodoPago: ['', [Validators.required]],
			ruc: [{ value: '', disabled: true }],
			direccion: [{ value: '', disabled: true }],
			telefono: [{ value: '', disabled: true }],
			correo: [{ value: '', disabled: true }],
			categoria: [''],
			producto: [''],
			comentario: [''],
		});
	}

	onProveedorChange(event: any) {
		const proveedorId = event.target.value;
		this.compraForm.patchValue({ proveedor: proveedorId });

		const proveedor = this.proveedores.find((p) => p.id_proveedor === proveedorId);
		if (proveedor) {
			const { tb_personas } = proveedor;
			this.proveedorSeleccionado = {
				ruc: tb_personas.numero_documento,
				direccion: tb_personas.tb_direccion.direccion,
				telefono: tb_personas.telefono,
				correo: tb_personas.correo,
			};
		}
	}
	onProductoChange(event: any) {
		const idProducto = event.target.value;
		const producto = this.productos.find((p) => p.id_producto === idProducto);
		if (producto) {
			this.productoSelecionado = {
				precio_venta: producto.precio_venta,
				stock: producto.stock,
			};
		}
	}

	agregarProducto() {
		const productoSeleccionado = this.productos.find((p) => p.id_producto === this.compraForm.get('producto')?.value);

		const categoriaSeleccionada = this.categorias.find(
			(c) => c.id_categoria === this.compraForm.get('categoria')?.value
		);

		if (!productoSeleccionado || !categoriaSeleccionada || !this.cantidad) {
			return;
		}

		const nuevoDetalle: DetalleProducto = {
			id_producto: productoSeleccionado.id_producto,
			categoria: categoriaSeleccionada.nombre_cat,
			producto: productoSeleccionado.nombre_producto,
			marca: productoSeleccionado.tb_marcas.nombre_marca || '-',
			precio_venta: Number(productoSeleccionado.precio_venta),
			cantidad: this.cantidad,
			total: Number(productoSeleccionado.precio_venta) * this.cantidad,
		};

		this.detalleProductos.push(nuevoDetalle);
		this.calcularTotales();
		this.resetearFormularioProducto();
	}

	private calcularTotales() {
		this.subtotal = this.detalleProductos.reduce((acc, item) => acc + item.total, 0);
		this.igv = this.subtotal * 0.18;
		this.total = this.subtotal + this.igv;
	}

	private resetearFormularioProducto() {
		this.compraForm.patchValue({
			categoria: '',
			producto: '',
		});
		this.cantidad = 1;
		this.productoSelecionado = {
			precio_venta: '',
			stock: 0,
		};
	}

	saveCompra() {
		if (!this.compraForm.get('proveedor')?.value) {
			this._message.error('Debe seleccionar un proveedor');
			return;
		}

		if (!this.compraForm.get('metodoPago')?.value) {
			this._message.error('Debe seleccionar un método de pago');
			return;
		}

		if (this.detalleProductos.length === 0) {
			this._message.error('Debe agregar al menos un producto');
			return;
		}

		const proveedorId = this.compraForm.get('proveedor')?.value;
		const proveedor = this.proveedores.find((p) => p.id_proveedor === proveedorId);

		if (!proveedor) {
			this._message.error('Proveedor no válido');
			return;
		}

		try {
			const requestData: RequestCompraDto = {
				proveedor_id: proveedorId,
				proveedor_ruc: this.proveedorSeleccionado.ruc,
				proveedor_correo: this.proveedorSeleccionado.correo,
				id_metodo_pago: this.compraForm.get('metodoPago')?.value,
				numero_documento: `COM-${new Date().getTime()}`,
				compra_comentario: this.compraForm.get('comentario')?.value || '',
				detalles: this.detalleProductos.map((detalle) => {
					const categoriaId = this.getCategoriaIdByName(detalle.categoria);
					return {
						id_producto: detalle.id_producto,
						id_categoria: categoriaId,
						cantidad: detalle.cantidad,
						precio_unitario: detalle.precio_venta,
					};
				}),
			};

			this._compraService.createCompra(requestData).subscribe({
				next: (response) => {
					this._message.success('Compra registrada exitosamente');
					this.resetForm();
				},
				error: (error) => {
					this._message.error('Error al registrar la compra: ' + (error.error?.message || error.message));
				},
			});
		} catch (error: any) {
			this._message.error(error.message);
		}
	}
	eliminarProducto(index: number) {
		this.detalleProductos.splice(index, 1);
		this.calcularTotales();
	}

	private getCategoriaIdByName(nombreCategoria: string): string {
		const categoria = this.categorias.find((c) => c.nombre_cat === nombreCategoria);
		if (!categoria) {
			throw new Error(`Categoría no encontrada: ${nombreCategoria}`);
		}
		return categoria.id_categoria;
	}

	private resetForm() {
		this.initForm();
		this.detalleProductos = [];
		this.subtotal = 0;
		this.igv = 0;
		this.total = 0;
		this.proveedorSeleccionado = {
			ruc: '',
			direccion: '',
			telefono: '',
			correo: '',
		};
		this.productoSelecionado = {
			precio_venta: '',
			stock: 0,
		};
	}
	limpiarFormulario() {
		this.resetForm();
		this._message.success('Formulario limpiado exitosamente');
	}

	obtenerNombreMostrarProveedor(proveedor: IProveedorCombo): string {
		if (proveedor.tb_personas.razon_social && proveedor.tb_personas.razon_social !== 'null') {
			return proveedor.tb_personas.razon_social;
		}

		const nombreCompleto = [
			proveedor.tb_personas.nombres,
			proveedor.tb_personas.apellido_paterno,
			proveedor.tb_personas.apellido_materno,
		]
			.filter(Boolean)
			.join(' ')
			.trim();

		if (nombreCompleto) {
			return nombreCompleto;
		}

		return 'Sin nombre';
	}
}
