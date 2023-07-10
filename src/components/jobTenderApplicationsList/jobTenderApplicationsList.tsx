import {EditIconTwo, Pagination, Table, Theme, Typography, PlusIcon, TrashIcon} from 'client-library';
import React, {useMemo, useState} from 'react';
import {DeleteModal} from '../../shared/deleteModal/deleteModal';
import {PlusButton, TableHeader} from './styles';
import {applicationsTableHeads} from '../../screens/jobTenders/constants';
import {JobTenderApplication} from '../../types/graphql/jobTenders';
import useJobTenderApplications from '../../services/graphql/jobTenders/useJobTenderApplicationOverview';
import useJobTendersDeleteApplication from '../../services/graphql/jobTenders/useJobTenderApplicationDelete';
import {ScreenProps} from '../../types/screen-props';
import {JobTenderApplicationModal} from '../JobTenderApplicationModal/JobTenderApplicationModal';

export interface JobTenderDetailsListProps extends ScreenProps {
  jobTenderId: number;
  alert: any;
}

const JobTenderApplicationsList: React.FC<JobTenderDetailsListProps> = ({jobTenderId, alert, ...props}) => {
  const [showModal, setShowModal] = useState(false);
  const [editItemId, setEditItemId] = useState(0);
  const [page, setPage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteItemID, setDeleteItemID] = useState(0);
  const {data: applications, refreshData} = useJobTenderApplications({page, size: 10, job_tender_id: jobTenderId});

  const {mutate: deleteJobTenderApplication} = useJobTendersDeleteApplication();

  const onPageChange = (page: number) => {
    setPage(page + 1);
  };

  const handleCloseDeleteModal = () => {
    setDeleteItemID(0);
    setShowDeleteModal(false);
  };

  const handleDelete = () => {
    deleteJobTenderApplication(
      deleteItemID,
      () => {
        refreshData();
        alert.success('Uspješno obrisano');
      },
      () => {
        alert.success('Brisanje nije uspješno');
      },
    );

    setDeleteItemID(0);
    setShowDeleteModal(false);
  };

  const handleEdit = (id: number) => {
    setEditItemId(id ?? 0);
    setShowModal(true);
  };

  const toggleApplicationModal = (id?: number) => {
    setShowModal(prev => !prev);
    if (id) {
      handleEdit(id);
    }
  };

  const editItem = useMemo(
    () => applications?.items?.find((item: JobTenderApplication) => item.id === editItemId),
    [applications, editItemId],
  );

  return (
    <>
      <TableHeader>
        <Typography variant="bodyMedium" content="Kandidati za ovaj oglas" />
        <PlusButton onClick={() => toggleApplicationModal()}>
          <PlusIcon width="12px" height="12px" stroke={Theme.palette.primary500} />
        </PlusButton>
      </TableHeader>
      <Table
        tableHeads={applicationsTableHeads}
        data={applications.items}
        style={{marginBottom: 22}}
        onRowClick={item => toggleApplicationModal(item.id)}
        tableActions={[
          {
            name: 'edit',
            onClick: item => toggleApplicationModal(item.id),
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
        pageCount={applications.total / 10}
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
      {showModal && (
        <JobTenderApplicationModal
          countries={props?.context?.countries || []}
          selectedItem={editItem}
          open={showModal}
          onClose={() => setShowModal(false)}
          jobTenderId={jobTenderId}
          alert={alert}
          refetchList={refreshData}
          {...props}
        />
      )}
    </>
  );
};
export default JobTenderApplicationsList;
