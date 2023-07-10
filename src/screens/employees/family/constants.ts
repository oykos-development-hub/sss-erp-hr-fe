import {TableHead} from 'client-library';

export const tableHeads: TableHead[] = [
  {title: 'Br.', accessor: 'id', type: 'text'},
  {
    title: 'Ime',
    accessor: 'first_name',
    type: 'text',
  },
  {
    title: 'Prezime',
    accessor: 'last_name',
    type: 'text',
  },
  {title: 'Srodstvo', accessor: 'employee_relationship', type: 'text'},
  {title: 'Pol', accessor: 'gender', type: 'text'},
  {title: 'Datum Rođenja', accessor: 'date_of_birth', type: 'text'},
  {title: 'Korisnik Osiguranja', accessor: 'insurance_coverage', type: 'text'},
  {title: '', accessor: 'TABLE_ACTIONS', type: 'tableActions'},
];
