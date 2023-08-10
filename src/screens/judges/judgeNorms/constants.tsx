import React from 'react';
import {DropdownDataNumber} from '../../../types/dropdownData';
import {TableHead, Typography} from 'client-library';

export const judgeResolutionTableHeads: TableHead[] = [
  {
    title: 'Sudska jedinica',
    accessor: 'organization_unit',
    type: 'custom',
    renderContents: org => <Typography content={org.title} />,
  },
  {title: 'Odluka o broju predsjednika', accessor: 'available_slots_presidents'},
  {title: 'Ukupno po odluci', accessor: 'available_slots_judges'},
  {
    title: 'Ukupno po odluci',
    accessor: '',
    type: 'custom',
    renderContents: (_, row) => <Typography content={row.available_slots_judges + row.available_slots_presidents} />,
  },
  {title: 'Broj popunjenih mjesta predsjednika', accessor: 'number_of_presidents'},
  {title: 'Broj popunjenih mjesta sudija', accessor: 'number_of_judges'},
  {
    title: 'Ukupno zaposlenih',
    accessor: '',
    type: 'custom',
    renderContents: (_, row) => <Typography content={row.number_of_presidents + row.number_of_judges} />,
  },
];

export const judgeNormsTableHeads: TableHead[] = [
  {title: 'Sudija', accessor: 'full_name'},
  {title: 'Materija', accessor: 'area'},
  {title: 'Norma', accessor: 'norm'},
  {title: 'Umanjenje norme', accessor: 'percentage_of_norm_decrease'},
  {title: 'Umanjena norma', accessor: 'number_of_items'},
  {title: 'Riješeno predmeta', accessor: 'number_of_solved_items'},
  {title: 'Ocjena', accessor: 'evaluation'},
  {title: 'Datum ocjene', accessor: 'evaluation_valid_to'},
  {title: 'Upućenje', accessor: 'relocation'},
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
    title: 'Job Position',
    accessor: 'job_position',
    type: 'custom',
    renderContents: (item: DropdownDataNumber) => <Typography content={item.title} />,
  },
  {title: 'Evaluation Score', accessor: 'evaluation_title'},
  {title: 'Relocation', accessor: 'relocation_title'},
];

export const judgesNumberResolutionTableHeads: TableHead[] = [
  {title: 'Redni Broj', accessor: 'serial_number'},
  {title: 'Godina', accessor: 'year'},
  {title: 'Ukupan Broj Sudija', accessor: 'number_of_judges'},
  {title: '', accessor: 'TABLE_ACTIONS', type: 'tableActions'},
];
