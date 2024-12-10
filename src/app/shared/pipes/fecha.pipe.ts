import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'dateFormat',
	standalone: true,
})
export class DateFormatPipe implements PipeTransform {
	transform(value: string | Date, ...args: any[]): string {
		if (!value) return '';

		const date = new Date(value);
		const options: Intl.DateTimeFormatOptions = {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit',
			hour12: true,
			timeZone: 'America/Lima',
		};

		const dateString = new Intl.DateTimeFormat('es-PE', options).format(date);

		return dateString;
	}
}
