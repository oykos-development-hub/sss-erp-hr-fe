import React from 'react';
import {DropdownDataNumber} from '../../../types/dropdownData';
import {TableHead, Typography} from 'client-library';
import {JudgeResolutionItem} from '../../../types/graphql/judges';

export const judgeResolutionTableHeads: TableHead[] = [
  {
    title: 'Sudska jedinica',
    accessor: 'organization_unit',
    type: 'custom',
    renderContents: (organizationUnit: DropdownDataNumber) => <Typography content={organizationUnit.title} />,
  },
  {title: 'Odluka o broju predsjednika', accessor: 'available_slots_presidents'},
  {title: 'Odluka o broju sudija', accessor: 'available_slots_judges', type: 'custom'},
  {
    title: 'Ukupno po odluci',
    accessor: 'total',
    type: 'custom',
  },
  {
    title: 'Broj popunjenih mjesta predsjednika',
    accessor: 'number_of_presidents',
    type: 'custom',
    renderContents: (_, row: JudgeResolutionItem) => <Typography content={row.number_of_presidents} />,
  },
  {
    title: 'Broj popunjenih mjesta sudija',
    accessor: 'number_of_judges',
    type: 'custom',
    renderContents: (_, row: JudgeResolutionItem) => <Typography content={row.number_of_judges} />,
  },
];

export const judgeNormsTableHeads: TableHead[] = [
  {
    title: 'Sudija',
    accessor: 'full_name',
  },
  {title: 'Materija', accessor: 'topic'},
  {title: 'Norma', accessor: 'title'},
  {title: 'Umanjenje norme %', accessor: 'number_of_norm_decrease'},
  {title: 'Umanjena norma', accessor: 'number_of_items'},
  {title: 'Riješeno predmeta', accessor: 'number_of_items_solved'},
  {title: 'Broj predmeta', accessor: 'number_of_items'},
  {title: '', accessor: 'TABLE_ACTIONS', type: 'tableActions'},
];

export const judgeTableHeads: TableHead[] = [
  {title: 'Sudija', accessor: 'full_name'},
  {
    title: 'Organizaciona jedinica',
    accessor: 'organization_unit',
    type: 'custom',
    renderContents: (item: DropdownDataNumber) => <Typography content={item.title} />,
  },
  {
    title: 'Pozicija',
    accessor: 'job_position',
    type: 'custom',
    renderContents: (item: DropdownDataNumber) => <Typography content={item.title} />,
  },
  {
    title: 'Rezultat procjene',
    accessor: 'evaluation_title',
  },
  {
    title: 'Relokacija',
    accessor: 'relocation_title',
  },
];

export const judgesNumberResolutionTableHeads: TableHead[] = [
  {title: 'Redni Broj', accessor: 'serial_number'},
  {title: 'Ukupan Broj Sudija', accessor: 'available_slots_judges'},
  {title: 'Status', accessor: 'active', type: 'badge'},
  {title: '', accessor: 'TABLE_ACTIONS', type: 'tableActions'},
];
