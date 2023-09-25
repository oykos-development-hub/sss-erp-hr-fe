export const systematizationDetailsTabs = (id: number) => [
  {id: 1, title: 'Pregled', routeName: 'overview', disabled: false},
  {id: 2, title: 'Štampaj', routeName: 'print', disabled: !id},
];
