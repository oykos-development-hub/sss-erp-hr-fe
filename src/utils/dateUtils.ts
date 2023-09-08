export const parseDate = (date: Date | string, parseForBFF?: boolean) => {
  const dateObj = new Date(date);
  const day = dateObj.toLocaleDateString('sr-latn-SR', {day: '2-digit'});
  const month = dateObj.toLocaleDateString('sr-latn-SR', {month: '2-digit'});
  const year = dateObj.toLocaleDateString('sr-latn-SR', {year: 'numeric'}).replace('.', '');

  return `${day}/${month}/${year}`;
};

// parses parseDate result back to Date object, e.g. 10/1/2022 to Date object
export const parseBackToDate = (dateString: string): Date => {
  const [day, month, year] = dateString.split('/').map(Number);

  return new Date(year, month - 1, day);
};

export const calculateExperience = (startDate: Date | string, endDate: Date | string) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffInMonths = end.getMonth() - start.getMonth() + 12 * (end.getFullYear() - start.getFullYear());

  return diffInMonths;
};

export const parseDateForBackend = (date: Date | null) => {
  if (!date) return '';

  const pickedDate = new Date(date);
  pickedDate.setMinutes(pickedDate.getMinutes() - pickedDate.getTimezoneOffset());

  return pickedDate.toISOString();
};

export const parseToDate = (dateString: string) => {
  if (!dateString) return null;

  return new Date(dateString);
};
