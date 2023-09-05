import React, {useMemo, useState} from 'react';
import {Typography, Button, Table, TableHead, TrashIcon, Theme, EditIconTwo} from 'client-library';
import {EvaluationPageProps} from './types';
import {Container} from './styles';
import {DeleteModal} from '../../../shared/deleteModal/deleteModal';
import {UserProfileEvaluation} from '../../../types/graphql/userProfileGetEvaluations';
import {EvaluationModal} from '../../../components/evaluationModal/evaluationModal';
import useEvaluationOverview from '../../../services/graphql/userProfile/evaluation/useEvaluationOverview';
import useEvaluationDelete from '../../../services/graphql/userProfile/evaluation/useEvaluationDelete';
import useSettingsDropdownOverview from '../../../services/graphql/settingsDropdown/useSettingsDropdownOverview';

const tableHeads: TableHead[] = [
  {title: 'Br.', accessor: 'id', type: 'text'},
  {title: 'Godina', accessor: 'date_of_evaluation', type: 'text'},
  {title: 'Ocjena', accessor: 'score', type: 'text'},
  {
    title: 'Pravosnažnost',
    accessor: 'is_relevant',
    type: 'custom',
    renderContents: (is_relevant: any) => <Typography variant="bodyMedium" content={is_relevant ? 'Da' : 'Ne'} />,
  },
  {title: '', accessor: 'TABLE_ACTIONS', type: 'tableActions'},
];

export const EvaluationsPage: React.FC<EvaluationPageProps> = ({context}) => {
  const userProfileID = context.navigation.location.pathname.split('/')[4];
  const {data: userEvaluationData, refetchData} = useEvaluationOverview(userProfileID);
  const {data: evaluationTypes} = useSettingsDropdownOverview({entity: 'evaluation_types'});

  const [showModal, setShowModal] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<number>(0);
  const selectedItem = useMemo(() => {
    return userEvaluationData?.find((item: UserProfileEvaluation) => item.id === selectedItemId);
  }, [selectedItemId]);

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const {mutate} = useEvaluationDelete(
    () => {
      refetchData();
      context.alert.success('Uspješno obrisano.');
    },
    () => {
      context.alert.error('Greška. Brisanje nije moguće.');
    },
  );

  const handleDeleteIconClick = (id: number) => {
    setShowDeleteModal(true);
    setSelectedItemId(id);
  };
  const handleAdd = () => {
    setShowModal(true);
  };

  const handleEdit = (item: UserProfileEvaluation) => {
    setSelectedItemId(item.id as number);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedItemId(0);
  };

  const handleDelete = () => {
    mutate(selectedItemId);
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
          data={userEvaluationData || []}
          tableActions={[
            {
              name: 'edit',
              onClick: item => handleEdit(item),
              icon: <EditIconTwo stroke={Theme?.palette?.gray800} />,
            },
            {
              name: 'delete',
              onClick: item => handleDeleteIconClick(item.id),
              icon: <TrashIcon stroke={Theme?.palette?.gray800} />,
            },
          ]}
        />
      </div>
      <EvaluationModal
        alert={context.alert}
        refetchList={refetchData}
        open={showModal}
        onClose={closeModal}
        selectedItem={selectedItem}
        userProfileId={userProfileID}
        evaluationTypes={evaluationTypes || []}
      />
      <DeleteModal open={showDeleteModal} onClose={() => setShowDeleteModal(false)} handleDelete={handleDelete} />
    </Container>
  );
};
