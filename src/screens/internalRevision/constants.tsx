import React from 'react';
import {TableHead, Typography} from 'client-library';

export const internalRevisionTableHeads: TableHead[] = [
  {title: 'BR', accessor: 'id'},
  {title: 'Godina', accessor: 'planned_year'},
  {title: 'Naziv revizije', accessor: 'title'},
  {title: 'Revizor koji radi reviziju', accessor: 'revisor_user_profile'},
  {title: 'Kvartal za sprovođenje revizije', accessor: 'planned_quarter'},
  {title: 'Subjekt revizije', accessor: 'revision_organization_unit'},
  {
    title: 'Vrsta revizije',
    accessor: 'revision_type',
    type: 'custom',
    renderContents: item => <Typography variant="bodyMedium" content={item.title} />,
  },
  {title: '', accessor: 'TABLE_ACTIONS', type: 'tableActions'},
];
