import {TableHead, Typography} from 'client-library';
import {parseDate} from '../../../utils/dateUtils';

export const RevisionTipImplementationsTableHeads: TableHead[] = [
  {
    title: 'Datum sprovođenja preporuke',
    accessor: 'new_date_of_execution',
    type: 'custom',
    renderContents: (_, row) => {
      let date = row.date_of_execution;
      if (!date) {
        date = row.updated_at;
      }
      return (
        <Typography variant="bodyMedium" content={parseDate(date)} />
      );
    },
  },
  {
    title: 'Status sprovođenja',
    accessor: 'status',
    type: 'custom',
    renderContents: item => <Typography variant="bodyMedium" content={item} />,
  },
  {
    title: 'Revizor',
    accessor: 'revisor',
    type: 'custom',
    renderContents: item => <Typography variant="bodyMedium" content={item.title} />,
  },
  {title: '', accessor: 'TABLE_ACTIONS', type: 'tableActions'},
];
