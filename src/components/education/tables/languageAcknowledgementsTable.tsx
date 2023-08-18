import {EditIconTwo, PlusIcon, TableHead, Theme, TrashIconTwo, Typography} from 'client-library';
import React, {useMemo, useState} from 'react';
import {TableProps} from '../../../screens/employees/education/types';
import {DeleteModal} from '../../../shared/deleteModal/deleteModal';
import {LanguageAcknowledgmentModal} from '../modals/languageAcknowledgmentModal';
import {AddIcon, TableContainer, TableTitle, TableTitleTypography} from './styles';
import useEducationOverview from '../../../services/graphql/userProfile/education/useEducationOverview';
import useEducationDelete from '../../../services/graphql/userProfile/education/useEducationDelete';

const tableHeads: TableHead[] = [
  {
    title: 'Broj',
    accessor: 'id',
    type: 'text',
  },
  {
    title: 'Jezik',
    accessor: 'type',
    sortable: true,
    type: 'custom',
    renderContents: (item: any) => <Typography variant="bodyMedium" content={item.title} />,
  },
  {
    title: 'Stepen',
    accessor: 'expertise_level',
    sortable: true,
    type: 'custom',
    renderContents: (item: any) => <Typography variant="bodyMedium" content={item} />,
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

export const LanguageAcknowledgmentTable: React.FC<TableProps> = ({languages, alert, navigation}) => {
  const {employeeEducationData, refetchData} = useEducationOverview(
    Number(navigation.location.pathname.split('/')[3]),
    'education_language_types',
  );
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItemId, setSelectedItemId] = React.useState(0);

  const {mutate: deleteEducation} = useEducationDelete();

  const selectedItem = useMemo(() => {
    return employeeEducationData?.find((item: any) => item.id === selectedItemId);
  }, [selectedItemId]);

  const handleEdit = (item: any) => {
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
        alert.success('Uspješno obrisano');
        refetchData();
      },
      () => {
        alert.error('Brisanje nije uspješno');
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
      <TableTitleTypography variant="bodySmall" content="Poznavanje jezika" />
      <AddIcon onClick={handleAdd}>
        <PlusIcon width={'18px'} />
      </AddIcon>
    </TableTitle>
  );

  return (
    <div>
      <TableContainer
        tableHeads={tableHeads}
        data={employeeEducationData || []}
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
          refetchList={refetchData}
          alert={alert}
          navigation={navigation}
        />
      )}
      <DeleteModal
        open={showDeleteModal}
        onClose={() => {
          handleCloseDeleteModal();
        }}
        handleDelete={handleDelete}
      />
    </div>
  );
};
