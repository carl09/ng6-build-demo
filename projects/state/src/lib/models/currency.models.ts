export const DEFAULT_CURRENCY = 'AUD';

export type currencyTypes = 'AUD' | 'USD';

export const convertCurrency = (currency: currencyTypes, value: number) => {
  console.log('convertCurrency', currency, value);
  switch (currency) {
    case 'AUD':
      return value;
    case 'USD':
      return value * 0.75;
    default:
      return 0;
  }
};
