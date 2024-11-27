export const formatCurrency = (
  input: number | string | null | undefined,
  hideSymbol?: boolean,
  symbolPositionLeft?: boolean,
): string => {
  const formatNumber = (num: number): string => {
    const parts = num.toFixed(2).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  };

  if (input === undefined || input === null || input === '') {
    return '';
  }

  const num = parseFloat(input.toString());
  if (isNaN(num)) {
    return '';
  }

  const formattedValue = formatNumber(num);

  if (hideSymbol) {
    return formattedValue;
  }

  return symbolPositionLeft ? `€ ${formattedValue}` : `${formattedValue} €`;
};
