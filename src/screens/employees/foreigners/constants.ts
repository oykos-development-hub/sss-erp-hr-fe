import {TableHead} from 'client-library';
import {parseDate} from '../../../utils/dateUtils';

export const tableHeads: TableHead[] = [
  {title: 'Radna Dozvola', accessor: 'work_permit_number'},
  {
    title: 'Datum Izdavanja',
    accessor: 'work_permit_date_of_start',
    type: 'custom',
    renderContents: value => parseDate(value),
  },
  {
    title: 'Datum Isteka',
    accessor: 'work_permit_date_of_end',
    type: 'custom',
    renderContents: value => parseDate(value),
  },
  {title: 'Viza', accessor: 'residence_permit_number'},
  {
    title: 'Datum Isteka',
    accessor: 'residence_permit_date_of_end',
    type: 'custom',
    renderContents: value => parseDate(value),
  },
  {title: 'Rezidentstvo', accessor: 'country_of_origin'},
  {title: '', accessor: 'TABLE_ACTIONS', type: 'tableActions'},
];
