import {
  Button,
  Divider,
  EditIconTwo,
  FileIcon,
  Table,
  Theme,
  TrashIconTwo,
} from 'client-library';
import React, {useState} from 'react';
import {FileItem} from '../../../components/fileModalView/types.ts';
import {RevisionTipsModal} from '../../../components/revisionTipsModal/revisionTipsModal.tsx';
import useAppContext from '../../../context/useAppContext.ts';
import useDeleteRevisionTip from '../../../services/graphql/revisionTips/useRevisionTipsDelete.ts';
import useGetRevisionTips from '../../../services/graphql/revisionTips/useRevisionTipsOverview.ts';
import {ConfirmModal} from '../../../shared/confirmModal/confirmModal.tsx';
import {ScreenWrapper} from '../../../shared/screenWrapper/screenWrapper.tsx';
import {MainTitle, RevisionListContainer, TableHeader} from '../styles.ts';
import {checkActionRoutePermissions} from '../../../services/checkRoutePermissions.ts';
import MultiFileModalView from '../../../components/fileModalViewMultiple/fileModalViewMultiple.tsx';
import { RevisionTipsTableHeads } from '../revisionTips/constants.tsx';

const RevisionTips = () => {
  const {
    alert,
    navigation,
    contextMain: {permissions},
  } = useAppContext();

  const updatePermittedRoutes = checkActionRoutePermissions(permissions, 'update');
  const updatePermission = updatePermittedRoutes.includes('/hr/revision-recommendations');

  const [deleteModal, setDeleteModal] = useState(0);
  const [revisionTipsModal, setRevisionTipsModal] = useState(false);
  const [editId, setEditId] = useState(0);
  const revisionId = navigation?.location?.pathname.split('/')[5];
  const revisionIdNumber = parseInt(revisionId);
  const toggleDeleteModal = (id: number) => {
    setDeleteModal(id);
  };
  const [filesToView, setFilesToView] = useState<FileItem[]>();

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
        alert.success('Uspješno obrisano.');
      },
      () => {
        toggleDeleteModal(0);
        alert.error('Greška. Brisanje nije moguće.');
      },
    );
  };

  const actionItems: any[] = [
    {
      name: 'showFile',
      icon: <FileIcon stroke={Theme.palette.gray600} />,
      onClick: (row: any) => {
        setFilesToView(row?.files);
      },
      shouldRender: (row: any) => row?.files?.length > 0,
    },
  ];

  if (updatePermission) {
    actionItems.push({
      name: 'Izmijeni',
      onClick: (item: any) => handleEdit(item.id),
      icon: <EditIconTwo stroke={Theme?.palette?.gray800} />,
    });
    actionItems.push({
      name: 'Obriši',
      onClick: (item: any) => toggleDeleteModal(item.id),
      icon: <TrashIconTwo stroke={Theme?.palette?.gray800} />,
    });
  }

  return (
    <ScreenWrapper>
      <RevisionListContainer>
        <MainTitle variant="bodyMedium" content="PREPORUKE" />
        <Divider color={Theme?.palette?.gray200} height="1px" />
        {updatePermission && (
          <TableHeader>
            <Button content="Dodajte preporuku" variant="secondary" onClick={() => toogleRevisionTipsModal(0)} />
          </TableHeader>
        )}

        <Table
          tableHeads={RevisionTipsTableHeads}
          data={revisionTips.items || []}
          style={{marginBottom: 22}}
          isLoading={loading}
          tableActions={actionItems}
        />

        <ConfirmModal open={!!deleteModal} onClose={() => toggleDeleteModal(0)} handleConfirm={handleDelete} />
      </RevisionListContainer>
      {filesToView && <MultiFileModalView files={filesToView} onClose={() => setFilesToView(undefined)} />}
      {revisionTipsModal && (
        <RevisionTipsModal
          open={revisionTipsModal}
          onClose={() => toogleRevisionTipsModal(0)}
          refetchList={refetch}
          alert={alert}
          id={editId}
          revisionId={revisionIdNumber}
        />
      )}
    </ScreenWrapper>
  );
};

export default RevisionTips;
