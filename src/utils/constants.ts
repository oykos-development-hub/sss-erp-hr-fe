export const employeeRelationshipDropdownData = [
  {id: 'Ćerka', title: 'Ćerka'},
  {id: 'Sin', title: 'Sin'},
  {id: 'Muž', title: 'Muž'},
  {id: 'Žena', title: 'Žena'},
];

export const cityData = [
  {id: 'Andrijevica', title: 'Andrijevica'},
  {id: 'Bar', title: 'Bar'},
  {id: 'Berane', title: 'Berane'},
  {id: 'Bijelo Polje', title: 'Bijelo Polje'},
  {id: 'Budva', title: 'Budva'},
  {id: 'Cetinje', title: 'Cetinje'},
  {id: 'Danilovgrad', title: 'Danilovgrad'},
  {id: 'Gusinje', title: 'Gusinje'},
  {id: 'Herceg Novi', title: 'Herceg Novi'},
  {id: 'Kolašin', title: 'Kolašin'},
  {id: 'Kotor', title: 'Kotor'},
  {id: 'Mojkovac', title: 'Mojkovac'},
  {id: 'Nikšić', title: 'Nikšić'},
  {id: 'Petnjica', title: 'Petnjica'},
  {id: 'Plav', title: 'Plav'},
  {id: 'Plužine', title: 'Plužine'},
  {id: 'Pljevlja', title: 'Pljevlja'},
  {id: 'Podgorica', title: 'Podgorica'},
  {id: 'Rožaje', title: 'Rožaje'},
  {id: 'Šavnik', title: 'Šavnik'},
  {id: 'Tivat', title: 'Tivat'},
  {id: 'Tuzi', title: 'Tuzi'},
  {id: 'Ulcinj', title: 'Ulcinj'},
  {id: 'Zeta', title: 'Zeta'},
  {id: 'Žabljak', title: 'Žabljak'},
];

export const yearsForDropdown = (numYearsToAdd?: number) => {
  const maxOffset = 10 + (numYearsToAdd || 0);
  const thisYear = new Date().getFullYear() + (numYearsToAdd || 0);
  const allYears = [];
  for (let x = 0; x < maxOffset; x++) {
    allYears.push({id: Number(thisYear - x), title: (thisYear - x).toString()});
  }
  return allYears;
};

export const yearsForDropdownFilter = (numYearsToAdd?: number) => {
  const maxOffset = 10 + (numYearsToAdd || 0);
  const thisYear = new Date().getFullYear() + (numYearsToAdd || 0);
  const allYears = [];
  allYears.push({id: '', title: 'Sve'});
  for (let x = 0; x < maxOffset; x++) {
    allYears.push({id: Number(thisYear - x), title: (thisYear - x).toString()});
  }
  return allYears;
};
