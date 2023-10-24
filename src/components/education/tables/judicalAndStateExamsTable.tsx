import {EditIconTwo, PlusIcon, TableHead, Theme, TrashIconTwo, Typography} from 'client-library';
import React, {useMemo, useState} from 'react';
import {TableProps} from '../../../screens/employees/education/types';
import useDeleteEducation from '../../../services/graphql/userProfile/education/useDeleteEducation';
import useGetEducation from '../../../services/graphql/userProfile/education/useGetEducation';
import {ConfirmModal} from '../../../shared/confirmModal/confirmModal';
import {DropdownDataNumber} from '../../../types/dropdownData';
import {parseDate} from '../../../utils/dateUtils';
import {educationTypes} from '../modals/constants';
import {JudicalAndStateExamsModal} from '../modals/judicalStateExamsModal';
import {AddIcon, TableContainer, TableTitle, TableTitleTypography} from './styles';
import {ProfileEducation, ProfileEducationItem} from '../../../types/graphql/userProfileEducation';

const tableHeads: TableHead[] = [
  {
    title: 'Tip',
    accessor: 'type',
    sortable: true,
    type: 'custom',
    renderContents: (value: DropdownDataNumber) => <Typography variant="bodyMedium" content={value.title} />,
  },
  {
    title: 'Datum polaganja',
    accessor: 'date_of_certification',
    sortable: true,
    type: 'custom',
    renderContents: (value: string) => <Typography content={parseDate(value)}></Typography>,
  },
  {
    title: 'Broj bodova',
    accessor: 'score',
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
  const {educationData, refetch, loading} = useGetEducation(
    Number(navigation.location.pathname.split('/')[4]),
    educationTypes.education_exam_types,
  );
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(0);

  const {deleteEducation} = useDeleteEducation();

  const tableData = educationData?.map((item: ProfileEducation) => ({
    ...item,
    score: item?.score,
  }));

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
      <TableTitleTypography variant="bodyLarge" content="Ispiti" />
      <AddIcon onClick={handleAdd}>
        <PlusIcon width={'18px'} stroke={Theme?.palette?.primary500} />
      </AddIcon>
    </TableTitle>
  );

  return (
    <div>
      <TableContainer
        tableHeads={tableHeads}
        data={tableData || []}
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
        <JudicalAndStateExamsModal
          open={showModal}
          onClose={handleCloseModal}
          selectedItem={selectedItem}
          refetchList={refetch}
          navigation={navigation}
          alert={alert}
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
