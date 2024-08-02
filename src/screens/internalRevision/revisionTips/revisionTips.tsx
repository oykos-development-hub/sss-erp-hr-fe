import {
  Button,
  Divider,
  EditIconTwo,
  FileIcon,
  FileUpload,
  Table,
  Theme,
  TrashIconTwo,
  Typography,
} from 'client-library';
import React, {useState} from 'react';
import {useForm} from 'react-hook-form';
import FileList from '../../../components/fileList/fileList.tsx';
import FileModalView from '../../../components/fileModalView/fileModalView';
import {FileItem} from '../../../components/fileModalView/types';
import {RevisionTipsModal} from '../../../components/revisionTipsModal/revisionTipsModal';
import useAppContext from '../../../context/useAppContext';
import useGetRevisionDetails from '../../../services/graphql/revision/useGetRevisionDetails';
import useInsertRevision from '../../../services/graphql/revision/useInsertRevisions';
import useDeleteRevisionTip from '../../../services/graphql/revisionTips/useRevisionTipsDelete';
import useGetRevisionTips from '../../../services/graphql/revisionTips/useRevisionTipsOverview';
import {ConfirmModal} from '../../../shared/confirmModal/confirmModal';
import {ScreenWrapper} from '../../../shared/screenWrapper/screenWrapper';
import {FileResponseItem} from '../../../types/fileUploadType';
import {FileUploadWrapper, MainTitle, RevisionListContainer, TableHeader} from '../styles';
import {RevisionTipsTableHeads} from './constants';
import {checkActionRoutePermissions} from '../../../services/checkRoutePermissions.ts';

const RevisionTips = () => {
  const {
    fileService: {uploadFile},
    alert,
    navigation,
    contextMain: {permissions},
  } = useAppContext();

  const updatePermittedRoutes = checkActionRoutePermissions(permissions, 'update');
  const updatePermission = updatePermittedRoutes.includes('/hr/revision-recommendations');

  const {handleSubmit} = useForm();
  const [uploadedFile, setUploadedFile] = useState<FileList | null>(null);
  const [deleteModal, setDeleteModal] = useState(0);
  const [revisionTipsModal, setRevisionTipsModal] = useState(false);
  const [editId, setEditId] = useState(0);
  const revisionId = navigation?.location?.pathname.split('/')[5];
  const revisionIdNumber = parseInt(revisionId);
  const toggleDeleteModal = (id: number) => {
    setDeleteModal(id);
  };
  const [fileToView, setFileToView] = useState<FileItem>();

  const {deleteRevisionTip} = useDeleteRevisionTip();

  const {revisionTips, loading, refetch} = useGetRevisionTips({page: 1, size: 1000, revision_id: revisionId});
  const {insertRevision} = useInsertRevision();
  const {revisionDetails, refetch: refetchDetails} = useGetRevisionDetails(revisionId);

  const handleUpload = (files: FileList) => {
    setUploadedFile(files);
  };

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

  const onSubmit = async () => {
    if (uploadedFile) {
      const formData = new FormData();
      formData.append('file', uploadedFile[0]);

      await uploadFile(formData, (files: FileResponseItem[]) => {
        setUploadedFile(null);
        const data = {
          id: revisionDetails?.id,
          title: revisionDetails?.title,
          plan_id: revisionDetails?.plan_id,
          serial_number: revisionDetails?.serial_number,
          date_of_revision: revisionDetails?.date_of_revision,
          revision_quartal: revisionDetails?.revision_quartal,
          internal_revision_subject_id: revisionDetails?.internal_revision_subject?.map((item: any) => item.id),
          external_revision_subject_id: revisionDetails?.external_revision_subject?.id || null,
          revisor_id: revisionDetails?.revisor?.map((item: any) => item.id) || null,
          revision_type_id: revisionDetails?.revision_type?.id || null,
          tips_file_id: files[0]?.id,
        };

        insertRevision(
          data,
          () => {
            refetchDetails();
            alert.success('Fajl uspješno sačuvan.');
          },
          () => {
            alert.error('Došlo je do greške prilikom dodavanja fajla.');
          },
        );
      });

      return;
    }
  };

  const actionItems: any[] = [
    {
      name: 'showFile',
      icon: <FileIcon stroke={Theme.palette.gray600} />,
      onClick: (row: any) => {
        setFileToView(row?.file);
      },
      shouldRender: (row: any) => row?.file?.id,
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
        <FileUploadWrapper>
          <FileUpload
            icon={null}
            disabled={!updatePermission}
            files={uploadedFile}
            variant="secondary"
            onUpload={handleUpload}
            note={<Typography variant="bodySmall" content="Preporuka" />}
            buttonText="Učitaj"
          />
        </FileUploadWrapper>

        {uploadedFile && <Button content="Sačuvajte fajl" variant="primary" onClick={handleSubmit(onSubmit)} />}

        {revisionDetails?.tips_file?.id !== 0 && (
          <FileList files={(revisionDetails?.tips_file && [revisionDetails?.tips_file]) ?? []} />
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
      {fileToView && <FileModalView file={fileToView} onClose={() => setFileToView(undefined)} />}

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
