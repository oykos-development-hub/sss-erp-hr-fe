import React from 'react';
import {TableHead, Typography, Badge} from 'client-library';
import {parseDate} from '../../utils/dateUtils';

const resolveVariant = (id: number) => {
  switch (id) {
    case 1:
      return 'warning';
    case 2:
      return 'success';
    default:
      return 'primary';
  }
};

export const systematizationDetailsTabs = (id: number) => [
  {id: 1, title: 'Pregled', routeName: 'overview', disabled: false},
  {id: 2, title: 'Štampaj', routeName: 'print', disabled: !id},
];

export const systematizationTableHeads: TableHead[] = [
  {title: 'Broj sistematizacije', accessor: 'serial_number', type: 'text', width: '30%'},
  {
    title: 'Datum izdavanja',
    accessor: 'date_of_activation',
    type: 'custom',
    renderContents: (item: any) => {
      return <Typography variant="bodyMedium" content={item !== '' ? parseDate(item) : ''} />;
    },
    width: '20%',
  },

  {
    title: 'Status',
    accessor: 'active',
    type: 'custom',
    renderContents: (id: number) => (
      <Badge
        style={{maxWidth: 150}}
        content={<Typography content={systematizationStatus[id] || 'Skica'} />}
        variant={resolveVariant(id)}
      />
    ),
    width: '20%',
  },
  {
    title: 'Organizaciona Jedinica',
    accessor: 'organization_unit',
    type: 'custom',
    renderContents: (item: any) => {
      return <Typography variant="bodyMedium" content={item.title} />;
    },
    width: '25%',
  },
  {title: '', accessor: 'TABLE_ACTIONS', type: 'tableActions'},
];

const systematizationStatus: {[key: number]: string} = {
  0: 'Skica',
  1: 'Neaktivna',
  2: 'Aktivna',
};
