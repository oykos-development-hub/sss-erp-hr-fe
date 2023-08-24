import React from 'react';
import {Button, Divider, EditIconTwo, Pagination, Table, Theme, TrashIcon} from 'client-library';
import {FC, useState} from 'react';
import {JobTendersListFilters} from '../../screens/jobTenders';
import {tableHeads} from '../../screens/jobTenders/constants';
import {DeleteModal} from '../../shared/deleteModal/deleteModal';
import {DropdownDataBoolean} from '../../types/dropdownData';
import {JobTender, JobTendersResponse} from '../../types/graphql/jobTenders';
import {MicroserviceProps} from '../../types/micro-service-props';
import {Controls, FilterDropdown, Filters, Header, MainTitle, OverviewBox} from './styles';

const statusFilter: DropdownDataBoolean[] = [
  {id: true, title: 'Aktivni'},
  {id: false, title: 'Neaktivni'},
];

export interface JobTendersListProps {
  navigate: (path: string) => void;
  toggleJobTenderImportModal: (item?: JobTender) => void;
  onPageChange: (page: number) => void;
  data: JobTendersResponse['data']['jobTenders_Overview'];
  dropdownJobTenderType: any[];
  organizationUnitsList: any[];
  onFilterChange: (value: any, name: string) => void;
  filters: JobTendersListFilters;
  deleteJobTender: (id: number) => void;
  context: MicroserviceProps;
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
  deleteJobTender,
  context,
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteItemID, setDeleteItemID] = useState(0);

  const handleCloseDeleteModal = () => {
    setDeleteItemID(0);
    setShowDeleteModal(false);
  };

  const handleDelete = () => {
    deleteJobTender(deleteItemID);
    setDeleteItemID(0);
    setShowDeleteModal(false);
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
            options={statusFilter as any}
            onChange={value => onFilterChange(value, 'active')}
            value={filters.active as any}
            name="active"
            placeholder="Odaberite status"
          />
        </Filters>
        <Controls>
          <Button
            content="Dodaj novi oglas"
            variant="secondary"
            style={{width: 170}}
            onClick={() => toggleJobTenderImportModal()}
          />
        </Controls>
      </Header>
      <Table
        tableHeads={tableHeads}
        data={data.items || []}
        style={{marginBottom: 22}}
        onRowClick={item => {
          navigate(`/hr/job-tenders/job-tenders-list/${item.id}`);
          context.breadcrumbs.add({
            name: `${item.id}`,
            to: `/hr/job-tenders/job-tenders-list/${item.id}`,
          });
        }}
        tableActions={[
          {
            name: 'edit',
            onClick: item => toggleJobTenderImportModal(item),
            icon: <EditIconTwo stroke={Theme?.palette?.gray800} />,
          },
          {
            name: 'delete',
            onClick: item => {
              setShowDeleteModal(true);
              setDeleteItemID(item.id);
            },
            icon: <TrashIcon stroke={Theme?.palette?.gray800} />,
          },
        ]}
      />
      <Pagination
        pageCount={data.total / 10}
        onChange={onPageChange}
        variant="filled"
        itemsPerPage={2}
        previousLabel="Previous"
        nextLabel="Next"
        pageRangeDisplayed={3}
      />
      <DeleteModal
        open={showDeleteModal}
        onClose={() => {
          handleCloseDeleteModal();
        }}
        handleDelete={handleDelete}
      />
    </OverviewBox>
  );
};

export default JobTendersList;
