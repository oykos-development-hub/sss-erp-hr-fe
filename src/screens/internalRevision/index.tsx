import {MicroserviceProps} from 'client-library';
import React, {useState} from 'react';
import InternalRevisionList from '../../components/internalRevisionList/internalRevisionList';
import InternalRevisionModal from '../../components/internalRevisionModal/internalRevisionModal';
import useInternalRevisions from '../../services/graphql/internalRevision/useRevisionOverview';
import {ScreenWrapper} from '../../shared/screenWrapper/screenWrapper';
import {InternalRevision} from '../../types/graphql/internalRevision';

const InternalRevision: React.FC<MicroserviceProps> = ({context}) => {
  const [internalRevisionModal, setInternalRevisionModal] = useState(false);
  const [editId, setEditId] = useState(0);
  const [revisorFilter, setRevisorFilter] = useState(0);
  const [page, setPage] = useState(1);

  const prepareTableData = (data: InternalRevision[]) => {
    return data.map(item => ({
      ...item,
      revisor_user_profile: item.revisor_user_profile?.title,
      revision_organization_unit: item.revision_organization_unit?.title,
      revision_type: item.revision_type,
    }));
  };

  const {data, refetch, loading} = useInternalRevisions({page, size: 10, revisor_user_profile_id: revisorFilter});

  const onPageChange = (page: number) => {
    setPage(page + 1);
  };

  const toggleInternalRevisionModal = (id: number) => {
    setEditId(id);
    setInternalRevisionModal(!internalRevisionModal);
  };

  const onFilter = (id: number) => {
    setRevisorFilter(id);
  };

  return (
    <ScreenWrapper context={context}>
      <InternalRevisionList
        data={data ? prepareTableData(data?.items) : []}
        navigate={context?.navigation?.navigate}
        onPageChange={onPageChange}
        toggleInternalRevisionModal={toggleInternalRevisionModal}
        total={data.total}
        revisorOptions={data?.revisors || []}
        revisorFilter={revisorFilter}
        onFilter={onFilter}
        alert={context.alert}
        refetchList={refetch}
        loading={loading}
      />

      {internalRevisionModal && (
        <InternalRevisionModal
          open={internalRevisionModal}
          onClose={() => toggleInternalRevisionModal(0)}
          id={editId}
          refetchList={refetch}
          revisorOptions={data?.revisors || []}
          alert={context.alert}
        />
      )}
    </ScreenWrapper>
  );
};

export default InternalRevision;
