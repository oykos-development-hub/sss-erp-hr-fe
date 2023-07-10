import {EditIconTwo, PlusIcon, TableHead, Theme, TrashIconTwo, Typography} from 'client-library';
import React, {useMemo, useState} from 'react';
import {TableProps} from '../../../screens/employees/education/types';
import {DeleteModal} from '../../../shared/deleteModal/deleteModal';
import {UserProfileEducationItem} from '../../../types/graphql/userProfileGetEducation';
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
    accessor: 'academic_title',
    sortable: true,
    type: 'custom',
    renderContents: (item: any) => <Typography variant="bodyMedium" content={item} />,
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

const mockedTableData = [
  {
    id: '001',
    number: '001',
    language: {label: 'Engleski', value: 'Engleski'},
    degree: {label: 'C1', value: 'C1'},
    file: 'sertifikat.pdf',
  },
  {
    id: '002',
    number: '002',
    language: {label: 'Francuski', value: 'Francuski'},
    degree: {label: 'C2', value: 'C2'},
    file: 'sertifikat.pdf',
  },
];

export const LanguageAcknowledgmentTable: React.FC<TableProps> = ({languages, alert}) => {
  const {employeeEducationData, refetchData} = useEducationOverview(1);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItemId, setSelectedItemId] = React.useState(0);

  let languageAcknowledgementTableData: UserProfileEducationItem[] = [] || mockedTableData;

  const {mutate: deleteEducation} = useEducationDelete();

  if (typeof employeeEducationData !== 'undefined') {
    employeeEducationData.forEach(tableData => {
      if (tableData.abbreviation === 'POJEZ') {
        languageAcknowledgementTableData = tableData.items ? tableData.items : [];
      }
    });
  }

  const selectedItem = useMemo(() => {
    return languageAcknowledgementTableData.find((item: UserProfileEducationItem) => item.id === selectedItemId);
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
        data={languageAcknowledgementTableData}
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
          dropdownData={languages}
          refetch={refetchData}
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
