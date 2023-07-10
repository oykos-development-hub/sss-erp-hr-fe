import {TableHead} from 'client-library';

export const tableHeads: TableHead[] = [
  {title: 'Radna Dozvola', accessor: 'work_permit_number'},
  {title: 'Datum Izdavanja', accessor: 'work_permit_date_of_start', sortable: true},
  {title: 'Datum Isteka', accessor: 'work_permit_date_of_end'},
  {title: 'Viza', accessor: 'resident_permit_number'},
  {title: 'Viza', accessor: 'resident_permit_date_of_end'},
  {title: 'Rezidentstvo', accessor: 'country_of_origin'},
  {title: '', accessor: 'TABLE_ACTIONS', type: 'tableActions'},
];
