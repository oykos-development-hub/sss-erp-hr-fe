import {TableHead, Typography} from 'client-library';
import {parseDate} from '../../../utils/dateUtils';

export const tableHeads: TableHead[] = [
  {
    title: 'Vrsta',
    accessor: 'resolution_type',
    type: 'custom',
    renderContents: (item: any) => {
      return <Typography variant="bodyMedium" content={item.title} />;
    },
  },
  {
    title: 'Datum izdavanja',
    accessor: 'date_of_start',
    type: 'custom',
    renderContents: (date_of_start: string) => <Typography content={date_of_start ? parseDate(date_of_start) : ''} />,
  },
  {
    title: 'Pripadajući dani godišnjeg odmora',
    accessor: 'value',
    type: 'custom',
    renderContents: (value: string) => <Typography content={value ? value : ''} />,
  },
  {title: 'Svrha', accessor: 'resolution_purpose', type: 'text'},
  {
    title: 'Pravosnažnost',
    accessor: 'is_affect',
    type: 'custom',
    renderContents: (is_affect, row) => (
      <Typography
        content={row.resolution_type?.title === 'Rješenje o godišnjem odmoru' ? '' : is_affect ? 'Da' : 'Ne'}
      />
    ),
  },
  {title: '', accessor: 'TABLE_ACTIONS', type: 'tableActions'},
];
