import {Button, EditIconTwo, FileIcon, Table, TableHead, Theme, TrashIcon, Typography} from 'client-library';
import {useMemo, useState} from 'react';
import {EvaluationModal} from '../../../components/evaluationModal/evaluationModal';
import {EvaluationModalForJudge} from '../../../components/evaluationModal/evaluationModalForJudge';
import FileModalView from '../../../components/fileModalView/fileModalView';
import {FileItem} from '../../../components/fileModalView/types';
import useAppContext from '../../../context/useAppContext';
import useGetSettings from '../../../services/graphql/settings/useGetSettings';
import useGetBasicInfo from '../../../services/graphql/userProfile/basicInfo/useGetBasicInfo';
import useDeleteEvaluations from '../../../services/graphql/userProfile/evaluation/useDeleteEvaluation';
import useGetEvaluations from '../../../services/graphql/userProfile/evaluation/useGetEvaluations';
import {ConfirmModal} from '../../../shared/confirmModal/confirmModal';
import {ProfileEvaluation} from '../../../types/graphql/evaluations';
import {parseDate} from '../../../utils/dateUtils';
import {Container} from './styles';

export const EvaluationsPage = () => {
  const {alert, navigation} = useAppContext();
  const userProfileID = navigation.location.pathname.split('/')[4];
  const {evaluations, refetch} = useGetEvaluations(userProfileID);
  const {settingsData, loading} = useGetSettings({entity: 'evaluation_types'});
  const [fileToView, setFileToView] = useState<FileItem>();
  const {userBasicInfo} = useGetBasicInfo(userProfileID, {skip: !userProfileID});

  const [showModal, setShowModal] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<number>(0);

  const tableHeads: TableHead[] = [
    {
      title: 'Godina',
      accessor: 'date_of_evaluation',
      type: 'custom',
      renderContents: (date: any) => <Typography variant="bodyMedium" content={parseDate(date)} />,
    },
    {
      title: 'Razlog ocjenjivanja',
      accessor: 'reason_for_evaluation',
      type: 'text',
      shouldRender: userBasicInfo?.is_judge,
    },
    {
      title: 'Ocjena',
      accessor: 'evaluation_type',
      type: 'custom',
      renderContents: (evaluation_type: any) => <Typography variant="bodyMedium" content={evaluation_type.title} />,
    },
    {
      title: 'Period ocjenjivanja',
      accessor: 'evaluation_period',
      type: 'text',
      shouldRender: userBasicInfo?.is_judge,
    },
    {
      title: 'Broj odluke',
      accessor: 'decision_number',
      type: 'text',
      shouldRender: userBasicInfo?.is_judge,
    },
    {
      title: 'Pravosnažnost',
      accessor: 'is_relevant',
      type: 'custom',
      renderContents: (is_relevant: any) => <Typography variant="bodyMedium" content={is_relevant ? 'Da' : 'Ne'} />,
    },
    {title: '', accessor: 'TABLE_ACTIONS', type: 'tableActions'},
  ];

  const selectedItem = useMemo(() => {
    return evaluations?.find((item: ProfileEvaluation) => item.id === selectedItemId);
  }, [selectedItemId]);

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const {deleteEvaluation} = useDeleteEvaluations();

  const handleDeleteIconClick = (id: number) => {
    setShowDeleteModal(true);
    setSelectedItemId(id);
  };
  const handleAdd = () => {
    setShowModal(true);
  };

  const handleEdit = (item: ProfileEvaluation) => {
    setSelectedItemId(item.id as number);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedItemId(0);
  };

  const handleDelete = () => {
    deleteEvaluation(
      selectedItemId,
      () => {
        refetch();
        alert.success('Uspješno obrisano.');
      },
      () => {
        alert.error('Greška. Brisanje nije moguće.');
      },
    );
    setShowDeleteModal(false);
    setSelectedItemId(0);
  };

  return (
    <Container>
      <span>
        <Button
          variant="secondary"
          content={<Typography variant="bodyMedium" content="Dodajte ličnu ocjenu" />}
          onClick={handleAdd}
        />
      </span>
      <div>
        <Table
          tableHeads={tableHeads}
          data={evaluations || []}
          isLoading={loading}
          tableActions={[
            {
              name: 'showFile',
              icon: <FileIcon stroke={Theme.palette.gray600} />,
              onClick: (row: any) => {
                setFileToView(row?.file);
              },
              shouldRender: (row: any) => row?.file?.id,
            },
            {
              name: 'Izmijeni',
              onClick: item => handleEdit(item),
              icon: <EditIconTwo stroke={Theme?.palette?.gray800} />,
            },
            {
              name: 'Obriši',
              onClick: item => handleDeleteIconClick(item.id),
              icon: <TrashIcon stroke={Theme?.palette?.gray800} />,
            },
          ]}
        />
      </div>
      {fileToView && <FileModalView file={fileToView} onClose={() => setFileToView(undefined)} />}
      {showModal && (
        <EvaluationModal
          alert={alert}
          refetchList={refetch}
          open={showModal}
          onClose={closeModal}
          selectedItem={selectedItem}
          userProfileId={userProfileID}
          evaluationTypes={settingsData || []}
        />
      )}
      {showModal && userBasicInfo?.is_judge && (
        <EvaluationModalForJudge
          alert={alert}
          refetchList={refetch}
          open={showModal}
          onClose={closeModal}
          selectedItem={selectedItem}
          userProfileId={userProfileID}
          evaluationTypes={settingsData || []}
          isPresident={userBasicInfo?.is_president}
        />
      )}

      <ConfirmModal open={showDeleteModal} onClose={() => setShowDeleteModal(false)} handleConfirm={handleDelete} />
    </Container>
  );
};
