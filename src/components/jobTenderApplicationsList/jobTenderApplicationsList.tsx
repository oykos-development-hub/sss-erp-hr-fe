import {EditIconTwo, Pagination, Table, Theme, Typography, PlusIcon, TrashIcon} from 'client-library';
import React, {useState} from 'react';
import {ConfirmModal} from '../../shared/confirmModal/confirmModal';
import {PlusButton, TableHeader} from './styles';
import {applicationsTableHeads} from '../../screens/jobTenders/constants';
import {JobTender} from '../../types/graphql/jobTenders';
import useJobTenderApplications from '../../services/graphql/jobTenderApplications/useGetJobTenderApplications';
import useDeleteJobTenderApplication from '../../services/graphql/jobTenderApplications/useDeleteJobTenderApplication';
import {ScreenProps} from '../../types/screen-props';
import {JobTenderApplicationModal} from '../JobTenderApplicationModal/JobTenderApplicationModal';
import {MicroserviceProps} from '../../types/micro-service-props';
import {JobTenderApplication} from '../../types/graphql/jobTenderApplications';
import {checkActionRoutePermissions} from '../../services/checkRoutePermissions.ts';

export interface JobTenderDetailsListProps extends ScreenProps {
  alert: any;
  context: MicroserviceProps;
  jobTender?: JobTender;
}

const JobTenderApplicationsList: React.FC<JobTenderDetailsListProps> = ({alert, context, jobTender, ...props}) => {
  const [showModal, setShowModal] = useState(false);
  const [editItemId, setEditItemId] = useState(0);
  const [page, setPage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteItemID, setDeleteItemID] = useState(0);
  const {jobTenderApplications, refetch, loading, total} = useJobTenderApplications(
    {page, size: 10, job_tender_id: jobTender?.id},
    {skip: !jobTender?.id},
  );
  const updatePermittedRoutes = checkActionRoutePermissions(context.contextMain.permissions, 'update');
  const updatePermission = updatePermittedRoutes.includes('/hr/job-tenders/job-tenders-list');

  const {deleteJobTenderApplication} = useDeleteJobTenderApplication();

  const tableData = jobTenderApplications.map((item: JobTenderApplication) => ({
    ...item,
    full_name: `${item.first_name} ${item.last_name}`,
  }));

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
        refetch();
        context.alert.success('Uspješno obrisano.');
      },
      () => {
        context.alert.error('Greška. Brisanje nije moguće');
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

    handleEdit(id || 0);
  };

  const editItem = jobTenderApplications.find((item: JobTenderApplication) => item.id === editItemId);

  const canAddNewApplicants =
    jobTender?.number_of_vacant_seats &&
    jobTender?.number_of_vacant_seats >
      tableData.filter((application: JobTenderApplication) => application.status === 'Izabran').length;

  const actionItems: any[] = [];

  if (updatePermission) {
    actionItems.push({
      name: 'edit',
      onClick: (item: any) => toggleApplicationModal(item.id),
      icon: <EditIconTwo stroke={Theme?.palette?.gray800} />,
      shouldRender: () => !!canAddNewApplicants,
    });
    actionItems.push({
      name: 'delete',
      onClick: (item: any) => {
        setShowDeleteModal(true);
        setDeleteItemID(item.id);
      },
      icon: <TrashIcon stroke={Theme?.palette?.gray800} />,
      shouldRender: () => !!canAddNewApplicants,
    });
  }

  return (
    <>
      <TableHeader>
        <Typography variant="bodyMedium" content="Kandidati za ovaj oglas" />
        {updatePermission && canAddNewApplicants === true && (
          <PlusButton onClick={() => toggleApplicationModal()}>
            <PlusIcon width="12px" height="12px" stroke={Theme.palette.primary500} />
          </PlusButton>
        )}
      </TableHeader>
      <Table
        tableHeads={applicationsTableHeads}
        data={tableData || []}
        style={{marginBottom: 22}}
        isLoading={loading}
        onRowClick={row => toggleApplicationModal(row.id)}
        tableActions={actionItems}
      />
      <Pagination
        pageCount={total / 10}
        onChange={onPageChange}
        variant="filled"
        itemsPerPage={2}
        previousLabel="Previous"
        nextLabel="Next"
        pageRangeDisplayed={3}
      />
      <ConfirmModal
        open={showDeleteModal}
        onClose={() => {
          handleCloseDeleteModal();
        }}
        handleConfirm={handleDelete}
      />
      {updatePermission && showModal && (
        <JobTenderApplicationModal
          context={context}
          countries={context?.countries || []}
          selectedItem={editItem}
          open={showModal}
          onClose={() => setShowModal(false)}
          alert={alert}
          refetchList={refetch}
          jobTender={jobTender}
          applicationIds={jobTenderApplications.map((item: JobTenderApplication) => item?.user_profile?.id)}
          {...props}
        />
      )}
    </>
  );
};
export default JobTenderApplicationsList;
