import {EditIconTwo, PlusIcon, TableHead, Theme, TrashIconTwo, Typography} from 'client-library';
import React, {useMemo, useState} from 'react';
import {DeleteModal} from '../../../shared/deleteModal/deleteModal';
import {UserProfileEducationItem} from '../../../types/graphql/userProfileGetEducation';
import {AcademicEducationModal} from '../modals/academicEducationModal';
import {AddIcon, TableContainer, TableTitle, TableTitleTypography} from './styles';
import {TableProps} from '../../../screens/employees/education/types';
import useEducationOverview from '../../../services/graphql/userProfile/education/useEducationOverview';
import useEducationDelete from '../../../services/graphql/userProfile/education/useEducationDelete';

const tableHeads: TableHead[] = [
  {
    title: 'Stepen stručne osposobljenosti',
    accessor: 'academic_title',
    type: 'custom',
    renderContents: (item: any) => <Typography variant="bodyMedium" content={item} />,
  },
  {
    title: 'Stepen školskog obrazovanja',
    accessor: 'expertise_level',
    type: 'custom',
    renderContents: (item: any) => <Typography variant="bodyMedium" content={item} />,
  },
  {
    title: 'Izdavač sertifikata',
    accessor: 'certificate_issuer',
    type: 'custom',
    renderContents: (item: any) => <Typography variant="bodyMedium" content={item} />,
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

const mockedTableData = [
  {
    id: '001',
    academic_title: 'test',
    certificate_issuer: 'test',
    expertise_level: 'test',
    file_id: 'test.csv',
  },
];

export const AcademicEducationTable: React.FC<TableProps> = ({alert}) => {
  const {employeeEducationData, refetchData} = useEducationOverview(1);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItemId, setSelectedItemId] = React.useState(0);

  let academicEducationTableData: UserProfileEducationItem[] = [] || mockedTableData;

  const {mutate: deleteEducation} = useEducationDelete();

  if (typeof employeeEducationData !== 'undefined') {
    employeeEducationData.forEach(tableData => {
      if (tableData.abbreviation === 'AKDOB') {
        academicEducationTableData = tableData.items ? tableData.items : [];
      }
    });
  }

  const selectedItem = useMemo(() => {
    return academicEducationTableData.find((item: UserProfileEducationItem) => item.id === selectedItemId);
  }, [selectedItemId]);

  const handleEdit = (item: any) => {
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

  const title = (
    <TableTitle>
      <TableTitleTypography variant="bodySmall" content="Akademsko obrazovanje" />
      <AddIcon onClick={handleAdd}>
        <PlusIcon width={'18px'} />
      </AddIcon>
    </TableTitle>
  );
  return (
    <div>
      <TableContainer
        tableHeads={tableHeads}
        data={academicEducationTableData}
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
          refetch={refetchData}
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
