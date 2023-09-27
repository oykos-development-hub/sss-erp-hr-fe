import React from 'react';
import {TableHead, Typography} from 'client-library';
import {parseDate} from '../../../utils/dateUtils';

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
    title: 'Vrsta prilagodbe',
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
        const dayOfWeek = d.getDay();
        if (dayOfWeek !== 0 && dayOfWeek !== 6) {
          numberOfDays += 1;
        }
      }

      return <Typography variant="bodyMedium" content={numberOfDays} />;
    },
    width: '10%',
  },
  {title: 'Datoteka', accessor: 'file_id', type: 'text'},
  {title: '', accessor: 'TABLE_ACTIONS', type: 'tableActions'},
];

export const tableHeadsVacation: TableHead[] = [
  {
    title: 'Godina',
    accessor: 'date_of_start',
    type: 'custom',
    renderContents: (_, item: any) => {
      return <Typography variant="bodyMedium" content={item.year ? item.year : parseDate(item.date_of_start)} />;
    },
    width: '15%',
  },

  {
    title: 'Vrsta prilagodbe',
    accessor: 'absent_type',
    type: 'custom',
    renderContents: (item: any, row) => {
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
        const dayOfWeek = d.getDay();
        if (dayOfWeek !== 0 && dayOfWeek !== 6) {
          numberOfDays += 1;
        }
      }
      return <Typography variant="bodyMedium" content={row.number_of_days ? row.number_of_days : numberOfDays} />;
    },
    width: '10%',
  },
  {title: 'Datoteka', accessor: 'file_id', type: 'text'},
  {title: '', accessor: 'TABLE_ACTIONS', type: 'tableActions'},
];

export const tableHeadsYearVacation: TableHead[] = [
  {
    title: 'Godina',
    accessor: 'year',
    type: 'custom',
    renderContents: year => {
      return <Typography variant="bodyMedium" content={year} />;
    },
    width: '15%',
  },
  {
    title: 'Vrsta prilagodbe',
    accessor: 'resolution_type',
    type: 'custom',
    renderContents: item => {
      return <Typography variant="bodyMedium" content={item.title} />;
    },
    width: '30%',
  },
  {
    title: 'Dana',
    accessor: '',
    type: 'custom',
    renderContents: (_, row: any) => {
      return <Typography variant="bodyMedium" content={row.number_of_days ? row.number_of_days : ''} />;
    },
    width: '10%',
  },
  {title: 'Datoteka', accessor: 'file_id', type: 'text'},
  {title: '', accessor: 'TABLE_ACTIONS', type: 'tableActions'},
];
