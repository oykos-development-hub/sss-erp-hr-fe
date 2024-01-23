import {TableHead, Typography, Badge} from 'client-library';
import {parseDate} from '../../utils/dateUtils';
import {DropdownDataNumber} from '../../types/dropdownData';
import {UserProfile} from '../../types/graphql/userProfiles';

const resolveVariant = (id: number) => {
  switch (id) {
    case 0:
      return 'success';
    case 1:
      return 'warning';
  }
};

export const tableHeads: TableHead[] = [
  {title: 'Ime i Prezime', accessor: 'full_name', sortable: true},
  {
    title: 'Datum rođenja',
    accessor: 'date_of_birth',
    type: 'custom',
    renderContents: value => <Typography content={parseDate(value)} variant="bodyMedium" />,
  },
  {
    title: 'Organizaciona jedinica',
    accessor: 'organization_unit',
    type: 'custom',
    renderContents: organization_unit => <Typography content={organization_unit?.title} variant="bodyMedium" />,
  },
  {
    title: 'Radno mjesto',
    accessor: 'job_position',
    type: 'custom',
    renderContents: (job_position: DropdownDataNumber, row: UserProfile) => (
      <Typography
        content={row.is_judge ? 'Sudija' : row.is_judge_president ? 'Predsjednik suda' : job_position?.title}
        variant="bodyMedium"
      />
    ),
  },
  {
    title: 'Status',
    accessor: 'active',
    type: 'custom',
    renderContents: (active, row) =>
      row.active === 'Aktivan' ? (
        <Badge style={{maxWidth: 150}} content={<Typography content="Aktivan" />} variant="success" />
      ) : (
        <Badge style={{maxWidth: 150}} content={<Typography content="Neaktivan" />} variant="warning" />
      ),
  },
  {title: '', accessor: 'TABLE_ACTIONS', type: 'tableActions'},
];

export const employeeTabs = [
  {id: 1, title: 'Osnovni podaci', routeName: 'basic-info', disabled: false},
  {id: 2, title: 'Obrazovanje', routeName: 'education', disabled: false},
  {id: 3, title: 'Radna knjižica', routeName: 'experience', disabled: false},
  {id: 4, title: 'Članovi porodice', routeName: 'family-members', disabled: false},
  {id: 5, title: 'Dozvole', routeName: 'foreigner-permits', disabled: false},
  {id: 6, title: 'Parametri za obračun plata', routeName: 'salary-params', disabled: false},
  {id: 7, title: 'Lična ocjena', routeName: 'evaluations', disabled: false},
  {id: 10, title: 'Odsutnost', routeName: 'absents', disabled: false},
  {id: 12, title: 'Potvrde i rješenja', routeName: 'confirmations', disabled: false},
];
