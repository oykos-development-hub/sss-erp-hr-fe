import React from 'react';
import {TableHead, Typography} from 'client-library';
import {parseDate} from '../../../utils/dateUtils';

export function formatExperience(years: number, months: number, days: number) {
  let result = '';
  if (years > 0) {
    result += years && `${years} god,`;
  }

  if (months > 0) {
    // result += result.length > 0 ? ' i ' : '';
    result += months && ` ${months} mj,`;
  }

  if (days > 0) {
    result += result.length > 0 ? ' i ' : '';
    result += months && `${months} dan.`;
  }

  return result;
}

export const tableHeads: TableHead[] = [
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
      const isTotalExperience = row.id === ''; //  total experience row has an empty id and that row need to be bold

      return (
        <Typography
          variant="bodyMedium"
          style={{fontWeight: isTotalExperience ? 600 : ''}}
          content={formatExperience(
            row.years_of_insured_experience,
            row.months_of_insured_experience,
            row.days_of_insured_experience,
          )}
        />
      );
    },
  },
  {
    title: 'Radno iskustvo',
    accessor: 'amount_of_experience',
    type: 'custom',
    renderContents: (_, row: any) => {
      const isTotalExperience = row.id === ''; //  total experience row has an empty id and that row need to be bold

      return (
        <Typography
          variant="bodyMedium"
          style={{fontWeight: isTotalExperience ? 600 : ''}}
          content={formatExperience(row.years_of_experience, row.months_of_experience, row.days_of_experience)}
        />
      );
    },
  },

  {title: '', accessor: 'TABLE_ACTIONS', type: 'tableActions'},
];
