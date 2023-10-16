import React from 'react';
import {TableHead, Typography} from 'client-library';
import {parseDate} from '../../../utils/dateUtils';

export const RevisionTableHeads: TableHead[] = [
  {title: 'Naziv revizije', accessor: 'title'},
  {title: 'BR', accessor: 'serial_number'},
  {
    title: 'Datum revizije',
    accessor: 'date_of_revision',
    type: 'custom',
    renderContents: item => <Typography variant="bodyMedium" content={parseDate(item)} />,
  },
  {title: 'Kvartal', accessor: 'revision_quartal'},
  {
    title: 'Subjekt revizije',
    accessor: '',
    type: 'custom',
    renderContents: (_, row) => {
      return (
        <Typography
          variant="bodyMedium"
          content={
            row.internal_revision_subject.id ? row.internal_revision_subject.title : row.external_revision_subject.title
          }
        />
      );
    },
  },
  {
    title: 'Vrsta revizije',
    accessor: 'revision_type',
    type: 'custom',
    renderContents: item => <Typography variant="bodyMedium" content={item.title} />,
  },
  {title: 'Datoteka', accessor: 'file_id'},

  {title: '', accessor: 'TABLE_ACTIONS', type: 'tableActions'},
];
