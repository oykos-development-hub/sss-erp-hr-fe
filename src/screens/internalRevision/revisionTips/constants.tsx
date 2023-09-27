import React from 'react';
import {TableHead, Typography} from 'client-library';
import {parseDate} from '../../../utils/dateUtils';

export const RevisionTipsTableHeads: TableHead[] = [
  {title: 'Preporuka', accessor: 'recommendation'},
  {
    title: 'Datum sprovođenja preporuke',
    accessor: 'date_of_execution',
    type: 'custom',
    renderContents: item => <Typography variant="bodyMedium" content={parseDate(item)} />,
  },
  {title: 'Status sprovođenja', accessor: 'status'},
  {
    title: 'Revizor ',
    accessor: 'user_profile',
    type: 'custom',
    renderContents: item => <Typography variant="bodyMedium" content={item.title} />,
  },
  {title: '', accessor: 'TABLE_ACTIONS', type: 'tableActions'},
];
