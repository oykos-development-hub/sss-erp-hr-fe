import React from 'react';
import {TableHead, Typography} from 'client-library';
import {DropdownItemType} from '../../types/graphql/jobTenders';
import {DropdownDataString} from '../../types/dropdownData';

export const tableHeads: TableHead[] = [
  {
    title: 'Tip Oglasa',
    accessor: 'type',
    type: 'custom',
    renderContents: (item: DropdownItemType) => <Typography content={item?.title} />,
  },
  {
    title: 'Organizaciona jedinica',
    accessor: 'organization_unit',
    type: 'custom',
    renderContents: (item: DropdownItemType) => <Typography content={item?.title} />,
  },
  {title: 'Broj oglasa', accessor: 'serial_number'},
  {title: 'Datum objave', accessor: 'date_of_start'},
  {title: 'Kandidati', accessor: 'available_slots'},
  {title: 'Dokumenta', accessor: 'file_id'},
  {title: 'Status', accessor: 'active_badge', type: 'badge'},
  {
    title: '',
    accessor: 'TABLE_ACTIONS',
    type: 'tableActions',
  },
];

export const applicationsTableHeads: TableHead[] = [
  {
    title: 'Tip',
    accessor: 'type',
    sortable: true,
    type: 'custom',
    renderContents: (type: string) => {
      return <Typography content={applicationTypeOptions.find(option => option.id === type)?.title ?? ''} />;
    },
  },
  {
    title: 'Ime',
    accessor: 'first_name',
  },
  {title: 'Prezime', accessor: 'last_name'},
  {title: 'Datum rođenja', accessor: 'date_of_birth'},
  {title: 'Broj lične karte', accessor: 'official_personal_id'},
  {title: 'Datum prijave', accessor: 'date_of_application'},
  {title: 'Ocjena', accessor: 'evaluation'},
  {title: 'Status', accessor: 'status'},
  {
    title: '',
    accessor: 'TABLE_ACTIONS',
    type: 'tableActions',
  },
];

export const applicationTypeOptions: DropdownDataString[] = [
  {
    id: 'internal',
    title: 'Interni',
  },
  {
    id: 'external',
    title: 'Eksterni',
  },
];

export const evaluationTypeOptions: DropdownDataString[] = [
  {
    id: 'Dobar',
    title: 'Dobar',
  },
  {
    id: 'Los',
    title: 'Loš',
  },
  {
    id: 'Zao',
    title: 'Zao',
  },
];

export const applicationStatusOptions: DropdownDataString[] = [
  {
    id: 'waiting',
    title: 'Na čekanju',
  },
  {
    id: 'rejected',
    title: 'Odbijen',
  },
  {
    id: 'accepted',
    title: 'Prihvaćen',
  },
];
