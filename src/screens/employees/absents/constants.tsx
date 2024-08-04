import React from 'react';
import {TableHead, Typography} from 'client-library';
import {calculateBusinessDays, parseDate} from '../../../utils/dateUtils';
import {Parameter} from '../../../types/graphql/parameters.ts';

export const tableHeadsAbsence: TableHead[] = [
  {
    title: 'Godina',
    accessor: 'date_of_start',
    type: 'custom',
    renderContents: (_, item: any) => {
      return <Typography variant="bodyMedium" content={parseDate(item.date_of_start)} />;
    },
    width: '15%',
  },
  {
    title: 'Vrsta zahtjeva',
    accessor: 'absent_type',
    type: 'custom',
    renderContents: (item: any) => {
      return <Typography variant="bodyMedium" content={item.title} />;
    },
    width: '30%',
  },
  {
    title: 'Dana',
    accessor: '',
    type: 'custom',
    renderContents: (_, row: any) => {
      const startDate = new Date(row.date_of_start);
      const endDate = new Date(row.date_of_end);

      let numberOfDays = 0;

      for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        numberOfDays += 1;
      }

      return <Typography variant="bodyMedium" content={numberOfDays} />;
    },
    width: '10%',
  },
  {title: '', accessor: 'TABLE_ACTIONS', type: 'tableActions'},
];

export const tableHeadsVacation: TableHead[] = [
  {
    title: 'Godina',
    accessor: 'date_of_start',
    type: 'custom',
    renderContents: (_, item: any) => (
      <Typography variant="bodyMedium" content={item.year ? item.year : parseDate(item.date_of_start)} />
    ),
    width: '15%',
  },

  {
    title: 'Vrsta zahtjeva',
    accessor: 'absent_type',
    type: 'custom',
    renderContents: (item: any) => <Typography variant="bodyMedium" content={item.title} />,
    width: '30%',
  },

  {
    title: 'Dana',
    accessor: '',
    type: 'custom',
    renderContents: (_, row: any) => {
      const numberOfDays = calculateBusinessDays(row.date_of_start, row.date_of_end);
      return <Typography variant="bodyMedium" content={row.number_of_days ? row.number_of_days : numberOfDays} />;
    },
    width: '10%',
  },
  {title: '', accessor: 'TABLE_ACTIONS', type: 'tableActions'},
];

export const tableHeadsTemplates: TableHead[] = [
  {
    title: 'Naziv šablona',
    accessor: 'template',
    type: 'custom',
    renderContents: (template: any) => <Typography variant="bodyMedium" content={template?.title} />,
  },
  {title: '', accessor: 'TABLE_ACTIONS', type: 'tableActions'},
];

export const tableHeadsParameters: TableHead[] = [
  {
    title: 'Parametar',
    accessor: 'title',
    type: 'custom',
    renderContents: (title: string) => (
      <Typography variant="bodyMedium" style={{fontWeight: 'bold'}} content={`{${title}}`} />
    ),
  },
  {
    title: 'Opis',
    accessor: 'description',
    type: 'custom',
    renderContents: (description: string) => <Typography variant="bodyMedium" content={description} />,
  },
];
