import {EditIconTwo, PlusIcon, TableHead, Theme, TrashIconTwo, Typography, FileIcon} from 'client-library';
import React, {useMemo, useState} from 'react';
import {TableProps} from '../../../screens/employees/education/types';
import useDeleteEducation from '../../../services/graphql/userProfile/education/useDeleteEducation';
import useGetEducation from '../../../services/graphql/userProfile/education/useGetEducation';
import {ConfirmModal} from '../../../shared/confirmModal/confirmModal';
import {DropdownDataNumber} from '../../../types/dropdownData';
import {parseDate} from '../../../utils/dateUtils';
import {educationTypes} from '../modals/constants';
import {FunctionalAcknowledgmentModal} from '../modals/functionalAcknowledgmentsModal';
import {AddIcon, TableContainer, TableTitle, TableTitleTypography} from './styles';
import {ProfileEducation, ProfileEducationItem} from '../../../types/graphql/education';
import FileModalView from '../../fileModalView/fileModalView';
import {FileItem} from '../../fileModalView/types';

const tableHeads: TableHead[] = [
  {
    title: 'Funkcionalna znanja',
    accessor: 'expertise_level',
    sortable: true,
    type: 'text',
  },
  {
    title: 'Izvođač',
    accessor: 'certificate_issuer',
    sortable: true,
    type: 'text',
  },
  {
    title: 'Kotizacija',
    accessor: 'price',
    sortable: true,
    type: 'text',
  },
  {
    title: 'Početak',
    accessor: 'date_of_start',
    sortable: true,
    type: 'custom',
    renderContents: (item: string) => <Typography content={parseDate(item)}></Typography>,
  },
  {
    title: 'Kraj',
    accessor: 'date_of_end',
    sortable: true,
    type: 'custom',
    renderContents: (item: string) => <Typography content={parseDate(item)}></Typography>,
  },
  {
    title: 'Ocjena',
    accessor: 'type',
    sortable: true,
    type: 'custom',
    renderContents: (item: DropdownDataNumber) => <Typography content={item.title}></Typography>,
  },
  {
    title: '',
    accessor: 'TABLE_ACTIONS',
    type: 'tableActions',
  },
];

export const FunctionalAcknowledgmentTable: React.FC<TableProps> = ({alert, navigation, updatePermission}) => {
  const {educationData, refetch, loading} = useGetEducation(
    Number(navigation.location.pathname.split('/')[4]),
    educationTypes.education_functional_types,
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
      <TableTitleTypography variant="bodyLarge" content="Funkcionalna znanja" />
      {updatePermission && (
        <AddIcon onClick={handleAdd}>
          <PlusIcon width={'18px'} stroke={Theme?.palette?.primary500} />
        </AddIcon>
      )}
    </TableTitle>
  );

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
    actionItems.push({name: 'Izmijeni', onClick: handleEdit, icon: <EditIconTwo stroke={Theme?.palette?.gray800} />});
    actionItems.push({
      name: 'Obriši',
      onClick: (item: any) => handleDeleteIconClick(item.id),
      icon: <TrashIconTwo stroke={Theme?.palette?.gray800} />,
    });
  }

  return (
    <div>
      <TableContainer
        tableHeads={tableHeads}
        data={educationData || []}
        isLoading={loading}
        tableActions={actionItems}
        titleElement={title}
      />
      {fileToView && <FileModalView file={fileToView} onClose={() => setFileToView(undefined)} />}

      <FunctionalAcknowledgmentModal
        open={showModal}
        onClose={handleCloseModal}
        selectedItem={selectedItem}
        refetchList={refetch}
        navigation={navigation}
        alert={alert}
      />
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
