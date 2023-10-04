import {EditIconTwo, PlusIcon, TableHead, Theme, TrashIconTwo, Typography} from 'client-library';
import React, {useMemo, useState} from 'react';
import {DeleteModal} from '../../../shared/deleteModal/deleteModal';
import {AcademicEducationModal} from '../modals/academicEducationModal';
import {AddIcon, TableContainer, TableTitle, TableTitleTypography} from './styles';
import {TableProps} from '../../../screens/employees/education/types';
import useEducationOverview from '../../../services/graphql/userProfile/education/useEducationOverview';
import useEducationDelete from '../../../services/graphql/userProfile/education/useEducationDelete';
import {DropdownDataNumber} from '../../../types/dropdownData';
import {UserProfileEducation, UserProfileEducationItem} from '../../../types/graphql/userProfileGetEducation';
import {educationTypes} from '../modals/constants';

const tableHeads: TableHead[] = [
  {
    title: 'Stepen stručne osposobljenosti',
    accessor: 'academic_title',
    type: 'text',
  },
  {
    title: 'Stepen školskog obrazovanja',
    accessor: 'type',
    type: 'custom',
    renderContents: (item: DropdownDataNumber) => <Typography variant="bodyMedium" content={item.title} />,
  },
  {
    title: 'Institucija',
    accessor: 'certificate_issuer',
    type: 'text',
  },
  {
    title: 'Datoteka',
    accessor: 'file_id',
    type: 'text',
  },
  {
    title: '',
    accessor: 'TABLE_ACTIONS',
    type: 'tableActions',
  },
];

export const AcademicEducationTable: React.FC<TableProps> = ({alert, navigation}) => {
  const {employeeEducationData, refetchData, loading} = useEducationOverview(
    Number(navigation.location.pathname.split('/')[4]),
    educationTypes.education_academic_types,
  );
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(0);

  const {mutate: deleteEducation} = useEducationDelete();

  const selectedItem = useMemo(
    () => employeeEducationData?.find((item: UserProfileEducation) => item.id === selectedItemId),
    [selectedItemId],
  );

  const handleEdit = (item: UserProfileEducationItem) => {
    setSelectedItemId(item.id);
    setShowModal(true);
  };

  const handleDeleteIconClick = (id: number) => {
    setSelectedItemId(id);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setSelectedItemId(0);
    setShowDeleteModal(false);
  };

  const handleDelete = () => {
    deleteEducation(
      selectedItemId,
      () => {
        alert.success('Uspješno obrisano.');
        refetchData();
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

  const title = (
    <TableTitle>
      <TableTitleTypography variant="bodyLarge" content="Akademsko obrazovanje" />
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
        isLoading={loading}
        tableActions={[
          {name: 'edit', onClick: handleEdit, icon: <EditIconTwo stroke={Theme?.palette?.gray800} />},
          {
            name: 'delete',
            onClick: item => handleDeleteIconClick(item.id),
            icon: <TrashIconTwo stroke={Theme?.palette?.gray800} />,
          },
        ]}
        titleElement={title}></TableContainer>
      {showModal && (
        <AcademicEducationModal
          open={showModal}
          onClose={handleCloseModal}
          alert={alert}
          selectedItem={selectedItem}
          refetchList={refetchData}
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
