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
import {FileItem} from '../../../components/fileModalView/types';
import {RevisionTipsModal} from '../../../components/revisionTipsModal/revisionTipsModal';
import useAppContext from '../../../context/useAppContext';
import useDeleteRevisionTip from '../../../services/graphql/revisionTips/useRevisionTipsDelete';
import useGetRevisionTips from '../../../services/graphql/revisionTips/useRevisionTipsOverview';
import {ConfirmModal} from '../../../shared/confirmModal/confirmModal';
import {ScreenWrapper} from '../../../shared/screenWrapper/screenWrapper';
import {MainTitle, RevisionListContainer, TableHeader} from '../styles';
import {RevisionTipsTableHeads} from './constants';
import {checkActionRoutePermissions} from '../../../services/checkRoutePermissions.ts';
import MultiFileModalView from '../../../components/fileModalViewMultiple/fileModalViewMultiple.tsx';
import { MicroserviceProps } from '../../../types/micro-service-props.ts';
import useGetRevisionDetails from '../../../services/graphql/revision/useGetRevisionDetails.ts';
import { Typography } from '@oykos-development/devkit-react-ts-styled-components';
import { Row } from './styles.ts';
import FileList from '../../../components/fileList/fileList.tsx';
import { parseDate, parseToDate } from '../../../utils/dateUtils.ts';

interface RevisionTipsProps {
  context: MicroserviceProps;
}

const RevisionTips: React.FC<RevisionTipsProps> = ({context}) => {
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
  const planID = navigation?.location?.pathname.split('/')[3];
  const planIDNumber = parseInt(planID);

  const toggleDeleteModal = (id: number) => {
    setDeleteModal(id);
  };
  const [filesToView, setFilesToView] = useState<FileItem[]>();

  const {deleteRevisionTip} = useDeleteRevisionTip();

  const {revisionTips, loading, refetch} = useGetRevisionTips({page: 1, size: 1000, revision_id: revisionId});

  const {revisionDetails} = useGetRevisionDetails(revisionIdNumber);

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
        <MainTitle variant="bodyMedium" content="REVIZIJA" />
        <Divider color={Theme?.palette?.gray200} height="1px" />

        <Row>
          <Typography style={{fontWeight: 'bold'}} content="Naziv:" />
          <Typography content={revisionDetails.title} />
        </Row>
        <Row>
          <Typography style={{fontWeight: 'bold'}} content="Vrsta:" />
          <Typography content={revisionDetails.revision_type?.title} />
        </Row>
        {!revisionDetails.external_revision_subject?.title && (
          <Row>
            <Typography style={{fontWeight: 'bold'}} content="Subjekt (interna):" />
            <Typography content={revisionDetails.internal_revision_subject.map(subject => subject.title).join(', ')} />
          </Row>
        )}
        {revisionDetails.external_revision_subject?.title && (
          <Row>
            <Typography style={{fontWeight: 'bold'}} content="Subjekt (eksterna):" />
            <Typography content={revisionDetails.external_revision_subject?.title} />
          </Row>
        )}
        <Row>
          <Typography style={{fontWeight: 'bold'}} content="Revizori:" />
          <Typography content={revisionDetails.revisor.map(revisor => revisor.title.trim()).join(', ')} />
        </Row>
        <Row>
          <Typography style={{fontWeight: 'bold'}} content="Datum:" />
          <Typography content={parseDate(parseToDate(revisionDetails.date_of_revision))} />
        </Row>
        <Row>
          <Typography style={{fontWeight: 'bold'}} content="Kvartal za sprovođenje:" />
          <Typography content={revisionDetails.revision_quartal} />
        </Row>
        <Row>
          <Typography style={{fontWeight: 'bold'}} content="Fajlovi:" />
        </Row>
        {revisionDetails.files.length > 0 && (
          <FileList files={revisionDetails.files} />
        )}
      </RevisionListContainer>        

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
          onRowClick={row => {
            context.navigation.navigate(
              `/hr/revision-recommendations/${planIDNumber}/revision/${revisionIdNumber}/recommendations/${row.id}/implementations`,
            );
            context.breadcrumbs.add({
              name: `Sprovođenje preporuke za ${row.recommendation}`,
              to: `/hr/revision-recommendations/${planIDNumber}/revision/${revisionIdNumber}/recommendations/${row.id}/implementations`,
            });
          }}
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
