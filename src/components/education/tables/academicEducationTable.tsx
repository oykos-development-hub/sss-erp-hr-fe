import {EditIconTwo, PlusIcon, TableHead, Theme, TrashIconTwo, Typography, FileIcon} from 'client-library';
import React, {useMemo, useState} from 'react';
import {ConfirmModal} from '../../../shared/confirmModal/confirmModal';
import {AcademicEducationModal} from '../modals/academicEducationModal';
import {AddIcon, TableContainer, TableTitle, TableTitleTypography} from './styles';
import {TableProps} from '../../../screens/employees/education/types';
import useGetEducation from '../../../services/graphql/userProfile/education/useGetEducation';
import useDeleteEducation from '../../../services/graphql/userProfile/education/useDeleteEducation';
import {DropdownDataNumber} from '../../../types/dropdownData';
import {educationTypes} from '../modals/constants';
import {ProfileEducation, ProfileEducationItem} from '../../../types/graphql/education';
import {FileItem} from '../../fileModalView/types';
import FileModalView from '../../fileModalView/fileModalView';

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
    title: '',
    accessor: 'TABLE_ACTIONS',
    type: 'tableActions',
  },
];

export const AcademicEducationTable: React.FC<TableProps> = ({alert, navigation}) => {
  const {educationData, refetch, loading} = useGetEducation(
    Number(navigation.location.pathname.split('/')[4]),
    educationTypes.education_academic_types,
  );
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(0);
  const [fileToView, setFileToView] = useState<FileItem>();

  const {deleteEducation} = useDeleteEducation();

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

  const handleCloseDeleteModal = () => {
    setSelectedItemId(0);
    setShowDeleteModal(false);
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

  const title = (
    <TableTitle>
      <TableTitleTypography variant="bodyLarge" content="Obrazovanje" />
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
          {
            name: 'showFile',
            icon: <FileIcon stroke={Theme.palette.gray600} />,
            onClick: (row: any) => {
              setFileToView(row?.file);
            },
            shouldRender: (row: any) => row?.file?.id,
          },
          {name: 'Izmijeni', onClick: handleEdit, icon: <EditIconTwo stroke={Theme?.palette?.gray800} />},
          {
            name: 'Obriši',
            onClick: item => handleDeleteIconClick(item.id),
            icon: <TrashIconTwo stroke={Theme?.palette?.gray800} />,
          },
        ]}
        titleElement={title}></TableContainer>
      {fileToView && <FileModalView file={fileToView} onClose={() => setFileToView(undefined)} />}
      {showModal && (
        <AcademicEducationModal
          open={showModal}
          onClose={handleCloseModal}
          alert={alert}
          selectedItem={selectedItem}
          refetchList={refetch}
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
