import React from 'react';
import {TableHead, Typography} from 'client-library';
import {DropdownDataString} from '../../types/dropdownData';
import {DropdownItemType} from '../../types/graphql/jobTenders';
import {parseDate} from '../../utils/dateUtils';

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
  {
    title: 'Datum objave',
    accessor: 'date_of_start',
    type: 'custom',
    renderContents: (date_of_start: string) => <Typography content={date_of_start ? parseDate(date_of_start) : ''} />,
  },
  {title: 'Dokumenta', accessor: 'file_id'},
  {title: 'Status', accessor: 'active', type: 'badge', width: 150},
  {
    title: '',
    accessor: 'TABLE_ACTIONS',
    type: 'tableActions',
  },
];

export const applicationsTableHeads: TableHead[] = [
  {
    title: 'Tip Oglasa',
    accessor: 'tender_type',
    type: 'custom',
    renderContents: type => <Typography variant="bodyMedium" content={type.title} />,
  },
  {
    title: 'Ime',
    accessor: 'full_name',
  },
  {
    title: 'Datum rođenja',
    accessor: 'date_of_birth',
    sortable: true,
    type: 'custom',
    renderContents: (date_of_birth: string) => {
      return <Typography content={date_of_birth ? parseDate(date_of_birth) : ''} />;
    },
  },
  {title: 'Broj lične karte', accessor: 'official_personal_id'},
  {
    title: 'Datum prijave',
    accessor: 'date_of_application',
    sortable: true,
    type: 'custom',
    renderContents: (date_of_application: string) => {
      return <Typography content={date_of_application ? parseDate(date_of_application) : ''} />;
    },
  },
  {
    title: 'Organizaciona jedinica',
    accessor: 'organization_unit',
    type: 'custom',
    renderContents: item => <Typography variant="bodyMedium" content={item.title} />,
  },
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
    title: 'Nije izabran',
  },
  {
    id: 'accepted',
    title: 'Izabran',
  },
  {
    id: 'denied',
    title: 'Odbijen',
  },
];
