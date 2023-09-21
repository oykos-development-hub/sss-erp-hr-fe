import {TableHead} from 'client-library';

export const tableHeads: TableHead[] = [
  {title: 'Redni Broj', accessor: 'serial_number'},
  {title: 'Ukupan broj sudija', accessor: 'number_of_judges'},
  {title: 'Status', accessor: 'active', type: 'badge'},
];
