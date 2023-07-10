import {EditIconTwo, PlusIcon, TableHead, Theme, TrashIconTwo, Typography} from 'client-library';
import React, {useMemo, useState} from 'react';
import {DeleteModal} from '../../../shared/deleteModal/deleteModal';
import {UserProfileEducationItem} from '../../../types/graphql/userProfileGetEducation';
import {JudicalAndStateExamsModal} from '../modals/judicalStateExamsModal';
import {AddIcon, TableContainer, TableTitle, TableTitleTypography} from './styles';
import {TableProps} from '../../../screens/employees/education/types';
import useEducationOverview from '../../../services/graphql/userProfile/education/useEducationOverview';
import useEducationDelete from '../../../services/graphql/userProfile/education/useEducationDelete';

const tableHeads: TableHead[] = [
  {
    title: 'Tip',
    accessor: 'academic_title',
    sortable: true,
    type: 'custom',
    renderContents: (item: any) => <Typography variant="bodyMedium" content={item} />,
  },
  {
    title: 'Datum polaganja',
    accessor: 'date_of_certification',
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

const mockedTableData = [
  {
    id: '001',
    type: {label: 'Pravosudni ispit', value: 'Pravosudni ispit'},
    date: '01.01.2022',
    file: 'sertifikat.pdf',
  },
  {
    id: '002',
    type: {label: 'Drzavni ispit', value: 'Drzavni ispit'},
    date: '01.01.2022',
    file: 'sertifikat.pdf',
  },
];

export const JudicalAndStateExamsTable: React.FC<TableProps> = ({alert}) => {
  const {employeeEducationData, refetchData} = useEducationOverview(1);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItemId, setSelectedItemId] = React.useState(0);

  let judicalAndStateExamsTableData: UserProfileEducationItem[] = [] || mockedTableData;

  const {mutate: deleteEducation} = useEducationDelete();

  if (typeof employeeEducationData !== 'undefined') {
    employeeEducationData.forEach(tableData => {
      if (tableData.abbreviation === 'PRISP') {
        judicalAndStateExamsTableData = tableData.items ? tableData.items : [];
      }
    });
  }

  const selectedItem = useMemo(() => {
    return judicalAndStateExamsTableData.find((item: UserProfileEducationItem) => item.id === selectedItemId);
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
        data={judicalAndStateExamsTableData}
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
