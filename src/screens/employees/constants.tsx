import React from 'react';
import {Typography} from '@oykos-development/devkit-react-ts-styled-components';
import {TableHead} from 'client-library';
import {DropdownItemType} from '../../types/graphql/jobTenders';

export const tableHeads: TableHead[] = [
  {title: 'ID', accessor: 'id'},
  {title: 'Ime i Prezime', accessor: 'full_name', sortable: true},
  {title: 'Datum rođenja', accessor: 'date_of_birth'},
  {
    title: 'Organizaciona jedinica',
    accessor: 'organization_unit',
    type: 'custom',
    renderContents: (item: DropdownItemType) => <Typography variant="bodyMedium" content={item.title} />,
  },
  {
    title: 'Radno mjesto',
    accessor: 'job_position',
    type: 'custom',
    renderContents: (item: DropdownItemType) => <Typography variant="bodyMedium" content={item.title} />,
  },
  {title: 'Status', accessor: 'active', type: 'badge'},
  {title: '', accessor: 'TABLE_ACTIONS', type: 'tableActions'},
];

export const employeeTabs = [
  {id: 1, title: 'Osnovni Podaci', routeName: 'basic-info', disabled: false},
  {id: 2, title: 'Obrazovanje', routeName: 'education', disabled: false},
  {id: 3, title: 'Radna Knjižica', routeName: 'experience', disabled: false},
  {id: 4, title: 'Članovi Porodice', routeName: 'family-members', disabled: false},
  {id: 5, title: 'Dozvole', routeName: 'foreigner-permits', disabled: false},
  {id: 6, title: 'Parametri za Obračun Plata', routeName: 'salary-params', disabled: false},
  {id: 7, title: 'Lična Ocjena', routeName: 'evaluations', disabled: false},
  {id: 8, title: 'Rekapitulacija Zarada', routeName: 'rekapitulacija-zarada', disabled: false},
  {id: 9, title: 'Disciplinske mjere', routeName: 'disciplinske-mjere', disabled: false},
  {id: 10, title: 'Odsutnost', routeName: 'absents', disabled: false},
  {id: 12, title: 'Potvrde i Rješenja', routeName: 'confirmations', disabled: false},
];
