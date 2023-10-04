import {Button, Divider, EditIconTwo, Pagination, Table, Theme, TrashIcon} from 'client-library';
import React, {useState} from 'react';
import {MainTitle, OverviewBox} from '../../components/employeesList/styles';
import useAppContext from '../../context/useAppContext';
import useDeleteSystematization from '../../services/graphql/systematization/useDeleteSystematization';
import useGetSystematizations from '../../services/graphql/systematization/useGetSystematizations';
import {DeleteModal} from '../../shared/deleteModal/deleteModal';
import {ScreenWrapper} from '../../shared/screenWrapper/screenWrapper';
import {systematizationTableHeads} from './constants';
import {SystematizationFilters} from './filters/systematizationFilters';
import {Header} from './styles';

const initialValues = {
  search: '',
  organization_unit_id: 0,
  year: '',
};

const Systematizations: React.FC = () => {
  const [filters, setFilters] = useState(initialValues);
  const [page, setPage] = useState(1);
  const {systematizations, total, refetch, loading} = useGetSystematizations({...filters, page, size: 10});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(0);

  const {mutate} = useDeleteSystematization();

  const {
    navigation: {navigate},
    breadcrumbs,
    alert,
  } = useAppContext();

  const handleEdit = (id: number, serial_number: string) => {
    navigate(`/hr/systematization/systematization-details/${id}`);
    breadcrumbs.add({
      name: `Sistematizacija broj ${serial_number}`,
      to: `/hr/systematization/systematization-details/${id}`,
    });
  };

  const handleDeleteIconClick = (id: number) => {
    setShowDeleteModal(true);
    setSelectedItemId(id);
  };

  const handleDelete = () => {
    mutate(
      selectedItemId,
      () => {
        refetch();
        alert.success('Uspješno obrisano.');
      },
      () => {
        alert.error('Greška. Brisanje nije moguće.');
      },
    );
    setShowDeleteModal(false);
    setSelectedItemId(0);
  };

  const checkDate = (date: string): boolean => {
    if (!date) return true;

    const inputDate = new Date(date);
    const currentDate = new Date();

    return inputDate.getTime() > currentDate.getTime();
  };

  const onPageChange = (page: number) => setPage(page + 1);

  return (
    <ScreenWrapper>
      <OverviewBox>
        <MainTitle variant="bodyMedium" content="Sistematizacija" />
        <Divider color={Theme?.palette?.gray200} height="1px" />
        <Header>
          <SystematizationFilters
            setFilters={(name, value) => setFilters(prev => ({...prev, [name]: value}))}
            filters={filters}
          />
          <Button
            variant="secondary"
            content="Nova sistematizacija"
            onClick={() => {
              navigate('/hr/systematization/systematization-details');
              breadcrumbs.add({
                name: 'Nova sistematizacija',
                to: '/hr/systematization/systematization-details',
              });
            }}
          />
        </Header>
        <Table
          tableHeads={systematizationTableHeads}
          data={systematizations}
          isLoading={loading}
          style={{minWidth: 1000}}
          onRowClick={row => handleEdit(row.id, row.serial_number)}
          tableActions={[
            {
              name: 'edit',
              onClick: item => handleEdit(item.id, item.serial_number),
              icon: <EditIconTwo stroke={Theme?.palette?.gray800} />,
              shouldRender: row => row.active !== 1,
            },
            {
              name: 'delete',
              onClick: item => handleDeleteIconClick(item.id),
              icon: <TrashIcon stroke={Theme?.palette?.gray800} />,
              shouldRender: row => (!row.active && checkDate(row.date_of_activation) ? true : false),
            },
          ]}
        />
        <Pagination
          pageCount={Math.ceil(total / 10)}
          onChange={onPageChange}
          variant="filled"
          itemsPerPage={2}
          pageRangeDisplayed={3}
          style={{marginTop: 22}}
        />
        <DeleteModal open={showDeleteModal} onClose={() => setShowDeleteModal(false)} handleDelete={handleDelete} />
      </OverviewBox>
    </ScreenWrapper>
  );
};

export default Systematizations;
