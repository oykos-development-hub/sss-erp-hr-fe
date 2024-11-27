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
import useAppContext from '../../../context/useAppContext.ts';
import {ConfirmModal} from '../../../shared/confirmModal/confirmModal.tsx';
import {ScreenWrapper} from '../../../shared/screenWrapper/screenWrapper.tsx';
import {MainTitle, RevisionListContainer, TableHeader} from '../styles.ts';
import {RevisionTipImplementationsTableHeads} from './constants.tsx';
import {checkActionRoutePermissions} from '../../../services/checkRoutePermissions.ts';
import MultiFileModalView from '../../../components/fileModalViewMultiple/fileModalViewMultiple.tsx';
import useGetRevisionTipImplementations from '../../../services/graphql/revisionTipImplementation/useRevisionTipImplementationsOverview.ts';
import useDeleteRevisionTipImplementation from '../../../services/graphql/revisionTipImplementation/useRevisionTipImplementationDelete.ts';
import { RevisionTipImplementationModal } from '../../../components/revisionTipsImplementationModal/revisionTipImplementationModal.tsx';
import useGetRevisionTipDetails from '../../../services/graphql/revisionTips/useRevisionTipsDetails.ts';

const RevisionTips = () => {
  const {
    alert,
    navigation,
    contextMain: {permissions},
  } = useAppContext();

  const updatePermittedRoutes = checkActionRoutePermissions(permissions, 'update');
  const updatePermission = updatePermittedRoutes.includes('/hr/revision-recommendations');

  const [deleteModal, setDeleteModal] = useState(0);
  const [revisionTipImplModal, setRevisionTipImplModal] = useState(false);
  const [editId, setEditId] = useState(0);
  const tipID = navigation?.location?.pathname.split('/')[7];
  
  const {revisionTipDetails, loading: loadingRevisionTipDetails} = useGetRevisionTipDetails(+tipID);

  const toggleDeleteModal = (id: number) => {
    setDeleteModal(id);
  };
  const [filesToView, setFilesToView] = useState<FileItem[]>();

  const {deleteRevisionTipImplementation} = useDeleteRevisionTipImplementation();

  const {revisionTipImplementation, loading, refetch} = useGetRevisionTipImplementations({tip_id: tipID});

  const toogleRevisionTipImplModal = (id: number) => {
    setEditId(id);
    setRevisionTipImplModal((prev) => !prev);
  };

  const handleEdit = (id: number) => {
    toogleRevisionTipImplModal(id);
  };

  const handleDelete = () => {
    deleteRevisionTipImplementation(
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

  const isTipConducted = revisionTipImplementation.items?.some(item => item.status === 'Sprovedena');

  if (updatePermission) {
    actionItems.push({
      name: 'Izmijeni',
      onClick: (item: any) => handleEdit(item.id),
      icon: <EditIconTwo stroke={Theme?.palette?.gray800} />,
    });
    if (!isTipConducted) {
      actionItems.push({
        name: 'Obriši',
        onClick: (item: any) => toggleDeleteModal(item.id),
        icon: <TrashIconTwo stroke={Theme?.palette?.gray800} />,
      });
    }
  }


  return (
    <ScreenWrapper>
      <RevisionListContainer>
        <MainTitle variant="bodyMedium" content="SPROVOĐENJE PREPORUKE" />
        <Divider color={Theme?.palette?.gray200} height="1px" />
        {updatePermission && (
          <TableHeader>
            <Button disabled={isTipConducted} content="Dodajte sprovođenje preporuke" variant="secondary" onClick={() => toogleRevisionTipImplModal(0)} />
          </TableHeader>
        )}

        <Table
          tableHeads={RevisionTipImplementationsTableHeads}
          data={revisionTipImplementation.items || []}
          style={{marginBottom: 22}}
          isLoading={loading && loadingRevisionTipDetails}
          tableActions={actionItems}
        />

        <ConfirmModal open={!!deleteModal} onClose={() => toggleDeleteModal(0)} handleConfirm={handleDelete} />
      </RevisionListContainer>
      {filesToView && <MultiFileModalView files={filesToView} onClose={() => setFilesToView(undefined)} />}
      {revisionTipImplModal && (
        <RevisionTipImplementationModal
          open={revisionTipImplModal}
          onClose={() => toogleRevisionTipImplModal(0)}
          refetchList={refetch}
          alert={alert}
          id={editId}
          tipID={tipID}
          revisors={revisionTipImplementation.revisors}
          item={revisionTipImplementation.items?.find(item => item.id === editId)}
          revisionTip={revisionTipDetails!}
        />
      )}
    </ScreenWrapper>
  );
};

export default RevisionTips;
