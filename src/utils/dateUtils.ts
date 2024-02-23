export const parseDate = (date: Date | string | null, separator?: string) => {
  if (!date) return '';
  const dateObj = new Date(date);
  const day = dateObj.toLocaleDateString('sr-latn-SR', {day: '2-digit'});
  const month = dateObj.toLocaleDateString('sr-latn-SR', {month: '2-digit'});
  const year = dateObj.toLocaleDateString('sr-latn-SR', {year: 'numeric'}).replace('.', '');

  if (separator) return `${day}${separator}${month}${separator}${year}`;
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
  if (!date) return null;

  const pickedDate = new Date(date);
  pickedDate.setMinutes(pickedDate.getMinutes() - pickedDate.getTimezoneOffset());

  return pickedDate.toISOString();
};

export const parseToDate = (dateString: string | null) => {
  if (!dateString) return null;

  return new Date(dateString);
};

export const calculateBusinessDays = (start: string | Date, end: string | Date): number => {
  const startDate = typeof start === 'string' ? new Date(start) : start;
  const endDate = typeof end === 'string' ? new Date(end) : end;

  if (startDate > endDate) {
    console.error('Start date cannot be after end date.');
    return 0;
  }

  const currentDate = new Date(startDate);
  let businessDays = 0;

  while (currentDate <= endDate) {
    const dayOfWeek = currentDate.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) businessDays++;
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return businessDays;
};

export const findNextBusinessDay = (inputDate: string | Date): Date => {
  const date = new Date(inputDate);

  // Increment the date until it's a business day (Monday to Friday)
  do {
    date.setDate(date.getDate() + 1);
  } while (date.getDay() === 0 || date.getDay() === 6);

  return date;
};
