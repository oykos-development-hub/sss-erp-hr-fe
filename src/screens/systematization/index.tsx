import {Button, Divider, EditIconTwo, Table, TableHead, Theme, TrashIcon, Typography} from 'client-library';
import React, {useEffect, useState} from 'react';
import {MainTitle, OverviewBox} from '../../components/employeesList/styles';
import useSystematizationOverview from '../../services/graphql/systematization/useSystematizations';
import useSystematizationsDelete from '../../services/graphql/systematization/useSystematizationsDelete';
import {DeleteModal} from '../../shared/deleteModal/deleteModal';
import {ScreenWrapper} from '../../shared/screenWrapper';
import {ScreenProps} from '../../types/screen-props';
import {SystematizationFilters} from './filters/systematizationFilters';
import {Header} from './styles';
import {parseDate} from '../../utils/dateUtils';

const tableHeads: TableHead[] = [
  {title: 'Broj sistematizacije', accessor: 'serial_number', type: 'text'},
  {
    title: 'Datum izdavanja',
    accessor: 'date_of_activation',
    type: 'custom',
    renderContents: (item: any) => {
      return <Typography variant="bodyMedium" content={item !== '' ? parseDate(item) : ''} />;
    },
  },
  {
    title: 'Status',
    accessor: 'active',
    type: 'custom',
    renderContents: (item: any) => {
      return <Typography variant="bodyMedium" content={item ? 'Odobreno' : 'Nacrt'} />;
    },
  },
  {
    title: 'Organizaciona Jedinica',
    accessor: 'organization_unit',
    type: 'custom',
    renderContents: (item: any) => {
      return <Typography variant="bodyMedium" content={item.title} />;
    },
  },
  {title: '', accessor: 'TABLE_ACTIONS', type: 'tableActions'},
];

export const SystematizationScreen: React.FC<ScreenProps> = ({context}) => {
  const [params, setParams] = useState({page: 1, size: 10, organization_unit_id: 0, active: '', year: '', search: ''});
  const {data, refetch} = useSystematizationOverview(params);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(0);

  const {mutate, success, error} = useSystematizationsDelete(() => {
    if (success) {
      refetch();
      context.alert.success('Uspješno obrisano.');
    } else if (error) {
      context.alert.error('Greška. Brisanje nije moguće.');
    }
  });

  const {
    navigation: {navigate},
  } = context;

  const handleEdit = (id: number) => {
    navigate(`/hr/systematization/systematization-details/${id}`);
    context.breadcrumbs.add({
      name: `Sistematizacija broj ${id}`,
      to: `/hr/systematization/systematization-details/${id}`,
    });
  };

  const handleDeleteIconClick = (id: number) => {
    setShowDeleteModal(true);
    setSelectedItemId(id);
  };

  const handleDelete = () => {
    mutate(selectedItemId);
    setShowDeleteModal(false);
    setSelectedItemId(0);
  };

  const setFilters = (params: any) => {
    setParams((data: any) => ({...data, ...params}));
  };

  useEffect(() => {
    refetch();
  }, [params]);

  return (
    <ScreenWrapper context={context}>
      <OverviewBox>
        <MainTitle variant="bodyMedium" content="Sistematizacija" />
        <Divider color={Theme?.palette?.gray200} height="1px" />
        <Header>
          <SystematizationFilters setFilters={params => setFilters(params)} />
          <Button
            variant="secondary"
            content="Nova sistematizacija"
            onClick={() => {
              navigate('/hr/systematization/systematization-details');
              context.breadcrumbs.add({
                name: 'Nova sistematizacija',
                to: '/hr/systematization/systematization-details',
              });
            }}
          />
        </Header>
        <Table
          tableHeads={tableHeads}
          data={data || []}
          tableActions={[
            {
              name: 'edit',
              onClick: item => handleEdit(item.id),
              icon: <EditIconTwo stroke={Theme?.palette?.gray800} />,
            },
            {
              name: 'delete',
              onClick: item => handleDeleteIconClick(item.id),
              icon: <TrashIcon stroke={Theme?.palette?.gray800} />,
            },
          ]}
        />
        <DeleteModal open={showDeleteModal} onClose={() => setShowDeleteModal(false)} handleDelete={handleDelete} />
      </OverviewBox>
    </ScreenWrapper>
  );
};
