import {EditIconTwo, PlusIcon, TableHead, Theme, TrashIconTwo, Typography} from 'client-library';
import React, {useMemo, useState} from 'react';
import {TableProps} from '../../../screens/employees/education/types';
import {ConfirmModal} from '../../../shared/confirmModal/confirmModal';
import {LanguageAcknowledgmentModal} from '../modals/languageAcknowledgmentModal';
import {AddIcon, TableContainer, TableTitle, TableTitleTypography} from './styles';
import useGetEducation from '../../../services/graphql/userProfile/education/useGetEducation';
import useEducationDelete from '../../../services/graphql/userProfile/education/useDeleteEducation';
import {DropdownDataNumber} from '../../../types/dropdownData';
import {educationTypes} from '../modals/constants';
import {ProfileEducation, ProfileEducationItem} from '../../../types/graphql/education';

const tableHeads: TableHead[] = [
  {
    title: 'Jezik',
    accessor: 'type',
    sortable: true,
    type: 'custom',
    renderContents: (item: DropdownDataNumber) => <Typography variant="bodyMedium" content={item.title} />,
  },
  {
    title: 'Stepen',
    accessor: 'expertise_level',
    sortable: true,
    type: 'text',
  },
  {
    title: 'Datoteka',
    accessor: 'file_id',
    sortable: true,
    type: 'text',
  },
  {
    title: '',
    accessor: 'TABLE_ACTIONS',
    type: 'tableActions',
  },
];

export const LanguageAcknowledgmentTable: React.FC<TableProps> = ({alert, navigation}) => {
  const {educationData, refetch, loading} = useGetEducation(
    Number(navigation.location.pathname.split('/')[4]),
    educationTypes.education_language_types,
  );
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(0);

  const {deleteEducation} = useEducationDelete();

  const selectedItem = useMemo(
    () => educationData?.find((item: ProfileEducation) => item.id === selectedItemId),
    [selectedItemId],
  );

  const handleEdit = (item: ProfileEducationItem) => {
    setSelectedItemId(item.id);
    setShowModal(true);
  };

  const handleDeleteIconClick = (id: number) => {
    setSelectedItemId(id);
    setShowDeleteModal(true);
  };

  const handleDelete = () => {
    deleteEducation(
      selectedItemId,
      () => {
        alert.success('Uspješno obrisano.');
        refetch();
      },
      () => {
        alert.error('Greška. Brisanje nije moguće.');
      },
    );
    setShowDeleteModal(false);
    setSelectedItemId(0);
  };

  const handleAdd = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedItemId(0);
  };
  const handleCloseDeleteModal = () => {
    setSelectedItemId(0);
    setShowDeleteModal(false);
  };

  const title = (
    <TableTitle>
      <TableTitleTypography variant="bodyLarge" content="Poznavanje jezika" />
      <AddIcon onClick={handleAdd}>
        <PlusIcon width={'18px'} stroke={Theme?.palette?.primary500} />
      </AddIcon>
    </TableTitle>
  );
  return (
    <div>
      <TableContainer
        tableHeads={tableHeads}
        data={educationData || []}
        isLoading={loading}
        tableActions={[
          {name: 'edit', onClick: handleEdit, icon: <EditIconTwo stroke={Theme?.palette?.gray800} />},
          {
            name: 'edit',
            onClick: item => handleDeleteIconClick(item.id),
            icon: <TrashIconTwo stroke={Theme?.palette?.gray800} />,
          },
        ]}
        titleElement={title}></TableContainer>
      {showModal && (
        <LanguageAcknowledgmentModal
          open={showModal}
          onClose={handleCloseModal}
          selectedItem={selectedItem}
          refetchList={refetch}
          alert={alert}
          navigation={navigation}
        />
      )}
      <ConfirmModal
        open={showDeleteModal}
        onClose={() => {
          handleCloseDeleteModal();
        }}
        handleConfirm={handleDelete}
      />
    </div>
  );
};
