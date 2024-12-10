// area de ventas dia , mes y semana

export interface IResponseVentasHoySemanaMes {
	ventas_hoy: VentasHoy;
	ventas_semana: Ventas;
	ventas_mes: Ventas;
}

export interface VentasHoy {
	total_ventas: number;
	monto_total: number;
}

export interface Ventas {
	monto_total: number;
}

// area venta al mes

export interface IResponseVentasMeses {
	mes: number;
	total_ventas: number;
	numero_ventas: number;
}

// area de compras


