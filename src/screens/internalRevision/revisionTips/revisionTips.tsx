import {Button, Divider, EditIconTwo, Table, Theme, TrashIconTwo} from 'client-library';
import React, {useState} from 'react';
import {RevisionTipsModal} from '../../../components/revisionTipsModal/revisionTipsModal';
import useGetRevisionTips from '../../../services/graphql/revisionTips/useRevisionTipsOverview';
import {ConfirmModal} from '../../../shared/confirmModal/confirmModal';
import {ScreenWrapper} from '../../../shared/screenWrapper/screenWrapper';
import {MicroserviceProps} from '../../../types/micro-service-props';
import {MainTitle, RevisionListContainer, TableHeader} from '../styles';
import {RevisionTipsTableHeads} from './constants';
import useDeleteRevisionTip from '../../../services/graphql/revisionTips/useRevisionTipsDelete';

interface RevisionTipsListProps {
  context: MicroserviceProps;
}

const RevisionTips: React.FC<RevisionTipsListProps> = ({context}) => {
  const [deleteModal, setDeleteModal] = useState(0);
  const [revisionTipsModal, setRevisionTipsModal] = useState(false);
  const [editId, setEditId] = useState(0);
  const revisionId = context?.navigation?.location?.pathname.split('/')[5];
  const revisionIdNumber = parseInt(revisionId);
  const toggleDeleteModal = (id: number) => {
    setDeleteModal(id);
  };

  const {deleteRevisionTip} = useDeleteRevisionTip();

  const {revisionTips, loading, refetch} = useGetRevisionTips({page: 1, size: 1000, revision_id: revisionId});

  const toogleRevisionTipsModal = (id: number) => {
    setEditId(id);
    setRevisionTipsModal(!revisionTipsModal);
  };

  const handleEdit = (id: number) => {
    toogleRevisionTipsModal(id);
  };

  const handleDelete = () => {
    deleteRevisionTip(
      deleteModal,
      () => {
        toggleDeleteModal(0);
        refetch();
        context.alert.success('Uspješno obrisano.');
      },
      () => {
        toggleDeleteModal(0);
        context.alert.error('Greška. Brisanje nije moguće.');
      },
    );
  };

  return (
    <ScreenWrapper>
      <RevisionListContainer>
        <MainTitle variant="bodyMedium" content="PREPORUKE" />
        <Divider color={Theme?.palette?.gray200} height="1px" />
        <TableHeader>
          <Button content="Dodaj preporuku" variant="secondary" onClick={() => toogleRevisionTipsModal(0)} />
        </TableHeader>
        <Table
          tableHeads={RevisionTipsTableHeads}
          data={revisionTips.items || []}
          style={{marginBottom: 22}}
          isLoading={loading}
          tableActions={[
            {
              name: 'edit',
              onClick: item => handleEdit(item.id),
              icon: <EditIconTwo stroke={Theme?.palette?.gray800} />,
            },
            {
              name: 'delete',
              onClick: item => toggleDeleteModal(item.id),
              icon: <TrashIconTwo stroke={Theme?.palette?.gray800} />,
            },
          ]}
        />

        <ConfirmModal open={!!deleteModal} onClose={() => toggleDeleteModal(0)} handleConfirm={handleDelete} />
      </RevisionListContainer>

      {revisionTipsModal && (
        <RevisionTipsModal
          open={revisionTipsModal}
          onClose={() => toogleRevisionTipsModal(0)}
          refetchList={refetch}
          alert={context.alert}
          id={editId}
          context={context}
          revisionId={revisionIdNumber}
        />
      )}
    </ScreenWrapper>
  );
};

export default RevisionTips;
