import {Button, Divider, EditIconTwo, Pagination, Table, Theme, TrashIcon} from 'client-library';
import {FC, useState} from 'react';
import {statusOptions} from '../../constants';
import useAppContext from '../../context/useAppContext';
import {JobTendersListFilters} from '../../screens/jobTenders';
import {tableHeads} from '../../screens/jobTenders/constants';
import useDeleteJobTender from '../../services/graphql/jobTenders/useDeleteJobTender';
import {ConfirmModal} from '../../shared/confirmModal/confirmModal';
import {JobTender} from '../../types/graphql/jobTenders';
import {Controls, FilterDropdown, Filters, Header, MainTitle, OverviewBox} from './styles';

export interface JobTendersListProps {
  navigate: (path: string) => void;
  toggleJobTenderImportModal: (item?: JobTender) => void;
  onPageChange: (page: number) => void;
  data: JobTender[];
  dropdownJobTenderType: any[];
  organizationUnitsList: any[];
  onFilterChange: (value: any, name: string) => void;
  filters: JobTendersListFilters;
  loading: boolean;
  refetch: () => void;
  total: number;
}

const JobTendersList: FC<JobTendersListProps> = ({
  navigate,
  toggleJobTenderImportModal,
  onPageChange,
  data,
  dropdownJobTenderType,
  organizationUnitsList,
  onFilterChange,
  filters,
  loading,
  refetch,
  total,
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteItemID, setDeleteItemID] = useState(0);

  const {deleteJobTender} = useDeleteJobTender();

  const {alert, breadcrumbs} = useAppContext();

  const handleCloseDeleteModal = () => {
    setDeleteItemID(0);
    setShowDeleteModal(false);
  };

  const handleDelete = () => {
    deleteJobTender(
      deleteItemID,
      () => {
        refetch();
        alert.success('Uspješno obrisano.');
        setDeleteItemID(0);
        setShowDeleteModal(false);
      },
      () => {
        alert.error('Greška. Brisanje nije moguće.');
      },
    );
  };

  return (
    <OverviewBox>
      <MainTitle variant="bodyMedium" content="PREGLED SVIH OGLASA" />
      {/*TODO: theme color */}
      <Divider color="#615959" height="1px" />
      <Header>
        <Filters>
          <FilterDropdown
            label="TIP OGLASA:"
            options={dropdownJobTenderType as any}
            value={filters.type_id as any}
            name="type_id"
            onChange={value => onFilterChange(value, 'type_id')}
            placeholder="Tip oglasa"
          />
          <FilterDropdown
            label="ORGANIZACIONA JEDINICA:"
            options={organizationUnitsList as any}
            value={filters.organization_unit_id as any}
            name="organization_unit_id"
            onChange={value => onFilterChange(value, 'organization_unit_id')}
            placeholder="Odaberite organizacionu jedinicu"
          />
          <FilterDropdown
            label="STATUS:"
            options={statusOptions as any}
            onChange={value => onFilterChange(value, 'active')}
            value={filters?.active as any}
            name="active"
            placeholder="Odaberite status"
          />
        </Filters>
        <Controls>
          <Button
            content="Dodajte novi oglas"
            variant="secondary"
            style={{width: 170}}
            onClick={() => toggleJobTenderImportModal()}
          />
        </Controls>
      </Header>
      <Table
        tableHeads={tableHeads}
        data={data || []}
        style={{marginBottom: 22}}
        isLoading={loading}
        onRowClick={(item: JobTender) => {
          navigate(`/hr/job-tenders/job-tenders-list/${item.id}`);
          breadcrumbs.add({
            name: `${item.type?.title} - ${item.serial_number}`,
            to: `/hr/job-tenders/job-tenders-list/${item.id}`,
          });
        }}
        tableActions={[
          {
            name: 'edit',
            onClick: item => toggleJobTenderImportModal(item),
            icon: <EditIconTwo stroke={Theme?.palette?.gray800} />,
            shouldRender: (row: any) => row?.active,
          },
          {
            name: 'delete',
            onClick: item => {
              setShowDeleteModal(true);
              setDeleteItemID(item.id);
            },
            icon: <TrashIcon stroke={Theme?.palette?.gray800} />,
            shouldRender: (row: any) => row?.active,
          },
        ]}
      />
      <Pagination
        pageCount={total / 10}
        onChange={onPageChange}
        variant="filled"
        itemsPerPage={2}
        pageRangeDisplayed={3}
      />
      <ConfirmModal
        open={showDeleteModal}
        onClose={() => {
          handleCloseDeleteModal();
        }}
        handleConfirm={handleDelete}
      />
    </OverviewBox>
  );
};

export default JobTendersList;
