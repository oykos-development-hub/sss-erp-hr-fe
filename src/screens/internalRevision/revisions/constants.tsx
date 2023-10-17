import React from 'react';
import {TableHead, Typography} from 'client-library';
import {parseDate} from '../../../utils/dateUtils';
import {DropdownDataNumber} from '../../../types/dropdownData';

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
      let subject;

      if (row.internal_revision_subject) {
        subject = (
          <div>
            {row.internal_revision_subject.map((org: DropdownDataNumber) => (
              <Typography variant="bodyMedium" key={org.id} content={org.title} />
            ))}
          </div>
        );
      } else {
        subject = <Typography variant="bodyMedium" content={row.external_revision_subject.title} />;
      }

      return subject;
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
