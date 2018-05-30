import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'appCurrency' })
export class AppCurrencyPipe implements PipeTransform {
  transform(value: number, currency: string, locale: string): string {
    const x = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
    });
    return x.format(value);
  }
}
