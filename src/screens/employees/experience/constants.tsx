import React from 'react';
import {TableHead, Typography} from 'client-library';
import {parseDate} from '../../../utils/dateUtils';

export const tableHeads: TableHead[] = [
  {title: 'Br.', accessor: 'id', type: 'text'},
  {
    title: 'Sudstvo',
    accessor: 'relevant',
    type: 'custom',
    renderContents: (item: any) => {
      return item === 'hide' ? <></> : <Typography variant="bodyMedium" content={item ? 'Da' : 'Ne'} />;
    },
  },
  {
    title: 'Organizacija',
    accessor: 'organization_unit',
    type: 'custom',
  },
  {
    title: 'Početak',
    accessor: 'date_of_start',
    type: 'custom',
    renderContents: (item: any) => (item ? <Typography variant="bodyMedium" content={parseDate(item)} /> : <></>),
  },
  {
    title: 'Kraj',
    accessor: 'date_of_end',
    type: 'custom',
    renderContents: (item: any) => (item ? <Typography variant="bodyMedium" content={parseDate(item)} /> : <></>),
  },
  {
    title: 'Radni staž',
    accessor: 'amount_of_insured_experience',
    type: 'custom',
    renderContents: (_, row: any) => {
      return <Typography variant="bodyMedium" content={row.amount_of_insured_experience} />;
    },
  },
  {
    title: 'Radno iskustvo',
    accessor: 'amount_of_experience',
    type: 'custom',
    renderContents: (_, row: any) => <Typography variant="bodyMedium" content={row.amount_of_experience} />,
  },
  {title: 'Dosije', accessor: 'reference_file_id', type: 'text'},
  {title: '', accessor: 'TABLE_ACTIONS', type: 'tableActions'},
];
