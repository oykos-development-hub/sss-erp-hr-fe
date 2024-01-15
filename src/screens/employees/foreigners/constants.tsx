import React from 'react';
import {TableHead, Typography} from 'client-library';
import {parseDate} from '../../../utils/dateUtils';
import {ForeignerPermit} from '../../../types/graphql/foreignerPermits';

export const tableHeads: TableHead[] = [
  {title: 'Radna Dozvola', accessor: 'work_permit_number'},
  {
    title: 'Datum Izdavanja',
    accessor: 'work_permit_date_of_start',
    type: 'custom',
    renderContents: value => <Typography content={parseDate(value)} />,
  },
  {
    title: 'Datum Isteka',
    accessor: 'work_permit_date_of_end',
    type: 'custom',
    renderContents: (_, row: ForeignerPermit) => (
      <Typography content={row.work_permit_date_of_end ? parseDate(row.work_permit_date_of_end) : 'Neograničeno'} />
    ),
  },
  {title: 'Viza', accessor: 'residence_permit_number'},
  {
    title: 'Datum Isteka',
    accessor: 'residence_permit_date_of_end',
    type: 'custom',
    renderContents: value => <Typography content={parseDate(value)} />,
  },
  {title: 'Rezidentstvo', accessor: 'country_of_origin'},
  {title: '', accessor: 'TABLE_ACTIONS', type: 'tableActions'},
];
