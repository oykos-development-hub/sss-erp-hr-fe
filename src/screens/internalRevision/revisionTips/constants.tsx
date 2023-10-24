import {TableHead, Typography} from 'client-library';
import {parseDate} from '../../../utils/dateUtils';

export const RevisionTipsTableHeads: TableHead[] = [
  {title: 'Preporuka', accessor: 'recommendation'},
  {
    title: 'Datum sprovođenja preporuke',
    accessor: 'new_date_of_execution',
    type: 'custom',
    renderContents: (item, row) => (
      <Typography variant="bodyMedium" content={item ? parseDate(item) : parseDate(row.date_of_execution)} />
    ),
  },
  {
    title: 'Status sprovođenja',
    accessor: 'status',
    type: 'custom',
    renderContents: item => <Typography variant="bodyMedium" content={item} />,
  },
  {
    title: 'Revizor ',
    accessor: 'user_profile',
    type: 'custom',
    renderContents: item => <Typography variant="bodyMedium" content={item.title} />,
  },
  {title: '', accessor: 'TABLE_ACTIONS', type: 'tableActions'},
];
