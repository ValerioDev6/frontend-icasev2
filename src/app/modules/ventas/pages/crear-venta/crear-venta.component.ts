/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzTableModule } from 'ng-zorro-antd/table';
import { forkJoin } from 'rxjs';
import { IClienteComboResponse } from '../../../../core/interfaces/cliente.interface';
import { IMetodoPagoCombo } from '../../../../core/interfaces/metodos-pago.interface';
import { IProductosComboResponse } from '../../../../core/interfaces/producto.interface';
import { ISucursalComboBox } from '../../../../core/interfaces/sucursales.interface';
import { ClienteService } from '../../../../core/services/cliente.service';
import { MetodoPagoService } from '../../../../core/services/metodo-pago.service';
import { ProductoService } from '../../../../core/services/productos.service';
import { SucursalService } from '../../../../core/services/sucursales.service';
import { VentasService } from '../../../../core/services/ventas.service';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
interface DetalleProducto {
	id_producto: string;
	producto: string;
	marca: string;
	precio_unitario: number;
	cantidad: number;
	descuento: number;
	subtotal: number;
}

interface RequestDetalleVentaDto {
	id_producto: string;
	cantidad: number;
	precio_unitario: number;
	descuento?: number;
}

interface RequestVentaDto {
	id_cliente: string;
	// id_personal: string;
	id_metodo_pago: string;
	id_sucursal: string;
	tipo_documento: 'BOLETA' | 'FACTURA' | 'NOTA_CREDITO' | 'NOTA_DEBITO';
	estado_venta?: 'PENDIENTE' | 'COMPLETADA' | 'ANULADA';
	observaciones?: string;
	subtotal: number;
	impuesto: number;
	numero_documento?: string; // Añadir como opcional
	serie_documento?: string; // Añadir como opcional
	precio_total: number;
	detalles: RequestDetalleVentaDto[];
}
@Component({
	selector: 'app-crear-venta',
	standalone: true,
	imports: [
		FormsModule,
		NzIconModule,
		NzInputModule,
		NzDatePickerModule,
		NzFormModule,
		CommonModule,
		NzTableModule,
		ReactiveFormsModule,
		NzBreadCrumbModule,
	],
	templateUrl: './crear-venta.component.html',
	styleUrl: './crear-venta.component.scss',
})
export default class CrearVentaComponent implements OnInit {
	ventaForm!: FormGroup;
	clientes: IClienteComboResponse[] = [];
	metodosPago: IMetodoPagoCombo[] = [];
	productos: IProductosComboResponse[] = [];
	detalleProductos: DetalleProducto[] = [];
	sucursales: ISucursalComboBox[] = [];

	cantidad: number = 1;
	subtotal: number = 0;
	igv: number = 0;
	total: number = 0;
	descuento: number = 0;

	clienteSeleccionado = {
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
		private readonly _ventasService: VentasService,
		private readonly _proveedoresService: ClienteService,
		private readonly _productosService: ProductoService,
		private readonly _sucursaleService: SucursalService,
		private readonly _metodosPagos: MetodoPagoService,
		private readonly _fb: FormBuilder,
		private readonly _message: NzMessageService
	) {}

	ngOnInit() {
		forkJoin({
			clientes: this._proveedoresService.getClientesCombo(),
			productos: this._productosService.getProductosCombo(),
			metodosPago: this._metodosPagos.metodoPagoCombo(),
			sucursales: this._sucursaleService.getComboBoxSucursalesAll(),
		}).subscribe({
			next: (response) => {
				this.sucursales = response.sucursales;
				this.clientes = response.clientes;
				this.productos = response.productos;
				this.metodosPago = response.metodosPago;
			},
			error: (error) => console.error('Error cargando datos:', error),
		});

		this.initForm();
	}

	onMetodoPagoChange(event: any) {
		const metodoPagoId = event.target.value;
		this.ventaForm.patchValue({ metodoPago: metodoPagoId });
	}

	private initForm() {
		this.ventaForm = this._fb.group({
			cliente: ['', [Validators.required]],
			metodoPago: ['', [Validators.required]],
			// personal: ['9f5fb672-83d6-11ef-8655-00e04cf010f7'],
			fecha_venta: [new Date()],
			sucursal: ['', [Validators.required]],
			ruc: [{ value: '', disabled: true }],
			direccion: [{ value: '', disabled: true }],
			telefono: [{ value: '', disabled: true }],
			correo: [{ value: '', disabled: true }],
			tipo_documento: ['BOLETA', [Validators.required]], // Agregar selección de tipo de documento
			estado_venta: ['COMPLETADA'],
			producto: [''],
			observaciones: [''],
			descuento: [0],
		});
	}

	onClienteChange(event: any) {
		const clienteId = event.target.value;
		this.ventaForm.patchValue({ proveedor: clienteId });

		const cliente = this.clientes.find((p) => p.id_cliente === clienteId);
		if (cliente) {
			const { tb_personas } = cliente;
			this.clienteSeleccionado = {
				ruc: tb_personas.numero_documento,
				direccion: tb_personas.tb_direccion.direccion,
				telefono: tb_personas?.telefono,
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
		const productoSeleccionado = this.productos.find((p) => p.id_producto === this.ventaForm.get('producto')?.value);

		if (!productoSeleccionado) {
			this._message.error('Debe seleccionar un producto y categoría');
			return;
		}

		// Validar stock disponible
		if (this.cantidad > productoSeleccionado.stock) {
			this._message.error(`Solo hay ${productoSeleccionado.stock} unidades disponibles`);
			return;
		}

		const precioUnitario = Number(productoSeleccionado.precio_venta);

		// CORREGIR: Calcular subtotal considerando la cantidad
		const subtotal = precioUnitario * this.cantidad;

		const nuevoDetalle: DetalleProducto = {
			id_producto: productoSeleccionado.id_producto,
			producto: productoSeleccionado.nombre_producto,
			marca: productoSeleccionado.tb_marcas.nombre_marca || '-',
			precio_unitario: precioUnitario,
			cantidad: this.cantidad, // IMPORTANTE: Guardar la cantidad real
			descuento: this.descuento,
			subtotal: subtotal - this.descuento, // Subtotal menos descuento
		};

		// Verificar si el producto ya existe en el detalle
		const productoExistente = this.detalleProductos.find((p) => p.id_producto === nuevoDetalle.id_producto);

		if (productoExistente) {
			this._message.error('El producto ya ha sido agregado. Modifique la cantidad en el detalle.');
			return;
		}

		this.detalleProductos.push(nuevoDetalle);
		this.calcularTotales();
		this.resetearFormularioProducto();
	}

	// private calcularTotales() {
	// 	// CORREGIR: Calcular subtotal considerando cantidad y precio unitario
	// 	this.subtotal = this.detalleProductos.reduce(
	// 		(acc, item) => acc + item.precio_unitario * item.cantidad - (item.descuento || 0),
	// 		0
	// 	);

	// 	// Calcular IGV sobre el subtotal
	// 	this.igv = this.subtotal * 0.18;

	// 	// Calcular total
	// 	this.total = this.subtotal + this.igv;
	// }

	private calcularTotales() {
		// Calcular subtotal considerando cantidad y precio
		this.subtotal = this.detalleProductos.reduce((acc, item) => acc + item.precio_unitario * item.cantidad, 0);

		// Calcular descuento total
		const descuentoTotal = this.detalleProductos.reduce((acc, item) => acc + (item.descuento || 0), 0);

		// Restar descuento del subtotal
		this.subtotal -= descuentoTotal;

		// Calcular IGV
		this.igv = this.subtotal * 0.18;

		// Calcular total final
		this.total = this.subtotal + this.igv;
	}

	private resetearFormularioProducto() {
		this.ventaForm.patchValue({
			categoria: '',
			producto: '',
		});
		this.cantidad = 1;
		this.productoSelecionado = {
			precio_venta: '',
			stock: 0,
		};
	}
	calcularDescuentoTotal(): number {
		return this.detalleProductos.reduce((acc, item) => acc + (item.descuento || 0), 0);
	}
	saveVenta() {
		// Validaciones
		if (!this.ventaForm.get('cliente')?.value) {
			this._message.error('Debe seleccionar un cliente');
			return;
		}

		if (!this.ventaForm.get('metodoPago')?.value) {
			this._message.error('Debe seleccionar un método de pago');
			return;
		}

		if (!this.ventaForm.get('sucursal')?.value) {
			this._message.error('Debe seleccionar una sucursal');
			return;
		}

		if (this.detalleProductos.length === 0) {
			this._message.error('Debe agregar al menos un producto');
			return;
		}

		try {
			const requestData: RequestVentaDto = {
				id_cliente: this.ventaForm.get('cliente')?.value,
				id_metodo_pago: this.ventaForm.get('metodoPago')?.value,
				// id_personal: this.ventaForm.get('personal')?.value,
				id_sucursal: this.ventaForm.get('sucursal')?.value,
				tipo_documento: this.ventaForm.get('tipo_documento')?.value || 'BOLETA',
				estado_venta: this.ventaForm.get('estado_venta')?.value || 'COMPLETADA',
				observaciones: this.ventaForm.get('observaciones')?.value || '',
				subtotal: this.subtotal,
				numero_documento: `COM-${new Date().getTime()}`,
				serie_documento: `SERIE-${new Date().getTime()}`,
				impuesto: this.igv,
				precio_total: this.total,
				detalles: this.detalleProductos.map((detalle) => ({
					id_producto: detalle.id_producto,
					cantidad: detalle.cantidad,
					precio_unitario: detalle.precio_unitario,
					descuento: detalle.descuento,
				})),
			};

			this._ventasService.createVenta(requestData).subscribe({
				next: () => {
					this._message.success('Venta registrada exitosamente');
					this.resetForm();
				},
				error: (error) => {
					this._message.error('Error al registrar la venta: ' + (error.error?.message || error.message));
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

	private resetForm() {
		this.initForm();
		this.detalleProductos = [];
		this.subtotal = 0;
		this.igv = 0;
		this.total = 0;
		this.clienteSeleccionado = {
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
}
