import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'peruvianCurrency',
	standalone: true,
})
export class PeruvianCurrencyPipe implements PipeTransform {
	transform(value: number): string {
		return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(value);
	}
}
