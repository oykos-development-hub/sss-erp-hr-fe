import {EditIconTwo, PlusIcon, TableHead, Theme, TrashIconTwo, Typography} from 'client-library';
import React, {useMemo, useState} from 'react';
import {DeleteModal} from '../../../shared/deleteModal/deleteModal';
import {UserProfileEducation, UserProfileEducationItem} from '../../../types/graphql/userProfileGetEducation';
import {JudicalAndStateExamsModal} from '../modals/judicalStateExamsModal';
import {AddIcon, TableContainer, TableTitle, TableTitleTypography} from './styles';
import {TableProps} from '../../../screens/employees/education/types';
import useEducationOverview from '../../../services/graphql/userProfile/education/useEducationOverview';
import useEducationDelete from '../../../services/graphql/userProfile/education/useEducationDelete';
import {DropdownDataNumber} from '../../../types/dropdownData';
import {educationTypes} from '../modals/constants';
import {parseDate} from '../../../utils/dateUtils';

const tableHeads: TableHead[] = [
  {
    title: 'Tip',
    accessor: 'type',
    sortable: true,
    type: 'custom',
    renderContents: (item: DropdownDataNumber) => <Typography variant="bodyMedium" content={item.title} />,
  },
  {
    title: 'Datum polaganja',
    accessor: 'date_of_certification',
    sortable: true,
    type: 'custom',
    renderContents: (item: string) => <Typography content={parseDate(item)}></Typography>,
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

export const JudicalAndStateExamsTable: React.FC<TableProps> = ({alert, navigation}) => {
  const {employeeEducationData, refetchData} = useEducationOverview(
    Number(navigation.location.pathname.split('/')[4]),
    educationTypes.education_exam_types,
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

  const handleCloseDeleteModal = () => {
    setSelectedItemId(0);
    setShowDeleteModal(false);
  };

  const title = (
    <TableTitle>
      <TableTitleTypography variant="bodySmall" content="Pravosudni i državni ispit" />
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
        <JudicalAndStateExamsModal
          open={showModal}
          onClose={handleCloseModal}
          selectedItem={selectedItem}
          refetchList={refetchData}
          navigation={navigation}
          alert={alert}
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
