import {EditIconTwo, PlusIcon, TableHead, Theme, TrashIconTwo, Typography} from 'client-library';
import React, {useMemo, useState} from 'react';
import {TableProps} from '../../../screens/employees/education/types';
import useEducationDelete from '../../../services/graphql/userProfile/education/useEducationDelete';
import useEducationOverview from '../../../services/graphql/userProfile/education/useEducationOverview';
import {DeleteModal} from '../../../shared/deleteModal/deleteModal';
import {DropdownDataNumber} from '../../../types/dropdownData';
import {UserProfileEducation, UserProfileEducationItem} from '../../../types/graphql/userProfileGetEducation';
import {parseDate} from '../../../utils/dateUtils';
import {educationTypes} from '../modals/constants';
import {FunctionalAcknowledgmentModal} from '../modals/functionalAcknowledgmentsModal';
import {AddIcon, TableContainer, TableTitle, TableTitleTypography} from './styles';

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

export const FunctionalAcknowledgmentTable: React.FC<TableProps> = ({alert, navigation}) => {
  const {employeeEducationData, refetchData, loading} = useEducationOverview(
    Number(navigation.location.pathname.split('/')[4]),
    educationTypes.education_functional_types,
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
      <TableTitleTypography variant="bodyLarge" content="Funkcionalna znanja" />
      <AddIcon onClick={handleAdd}>
        <PlusIcon width={'18px'} stroke={Theme?.palette?.primary500} />
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
            name: 'edit',
            onClick: item => handleDeleteIconClick(item.id),
            icon: <TrashIconTwo stroke={Theme?.palette?.gray800} />,
          },
        ]}
        titleElement={title}
      />

      <FunctionalAcknowledgmentModal
        open={showModal}
        onClose={handleCloseModal}
        selectedItem={selectedItem}
        refetchList={refetchData}
        navigation={navigation}
        alert={alert}
      />
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
