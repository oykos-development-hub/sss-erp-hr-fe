import {TableHead} from 'client-library';
import {parseDate} from '../../../utils/dateUtils';

export const tableHeads: TableHead[] = [
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
  {title: 'Datum Rođenja', accessor: 'date_of_birth', type: 'custom', renderContents: value => parseDate(value)},
  {title: 'Korisnik Osiguranja', accessor: 'insurance_coverage', type: 'text'},
  {title: '', accessor: 'TABLE_ACTIONS', type: 'tableActions'},
];
