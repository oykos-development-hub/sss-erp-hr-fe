import {EditIconTwo, PlusIcon, TableHead, Theme, TrashIconTwo, Typography} from 'client-library';
import React, {useMemo, useState} from 'react';
import {DeleteModal} from '../../../shared/deleteModal/deleteModal';
import {UserProfileEducationItem} from '../../../types/graphql/userProfileGetEducation';
import {FunctionalAcknowledgmentModal} from '../modals/functionalAcknowledgmentsModal';
import {AddIcon, TableContainer, TableTitle, TableTitleTypography} from './styles';
import {TableProps} from '../../../screens/employees/education/types';
import useEducationOverview from '../../../services/graphql/userProfile/education/useEducationOverview';
import useEducationDelete from '../../../services/graphql/userProfile/education/useEducationDelete';

const tableHeads: TableHead[] = [
  {
    title: 'Funkcionalna znanja',
    accessor: 'academic_title',
    sortable: true,
    type: 'custom',
    renderContents: (item: any) => <Typography content={item}></Typography>,
  },
  {
    title: 'Izvođač',
    accessor: 'certificate_issuer',
    sortable: true,
    type: 'custom',
    renderContents: (item: any) => <Typography content={item}></Typography>,
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
    type: 'text',
  },
  {
    title: 'Kraj',
    accessor: 'date_of_end',
    sortable: true,
    type: 'text',
  },
  {
    title: 'Ocjena',
    accessor: 'expertise_level',
    sortable: true,
    type: 'custom',
    renderContents: (item: any) => <Typography content={item}></Typography>,
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
    certificate_issuer: {label: 'Scrum master', value: 'Scrum master'},
    contractor: {label: 'Agile Human', value: 'Agile Human'},
    price: '100 €',
    date_of_end: {label: '6 mjeseci', value: '6 mjeseci'},
    expertise_level: {label: 'Položio', value: 'Položio'},
    file_id: 'sertifikat.pdf',
  },
  {
    id: '002',
    certificate_issuer: {label: 'Project manager', value: 'Project manager'},
    contractor: {label: 'Agile Human', value: 'Agile Human'},
    price: '100 €',
    date_of_end: {label: '6 mjeseci', value: '6 mjeseci'},
    expertise_level: {label: 'Položio', value: 'Položio'},
    file: 'sertifikat.pdf',
  },
];

export const FunctionalAcknowledgmentTable: React.FC<TableProps> = ({alert}) => {
  const {employeeEducationData, refetchData} = useEducationOverview(1);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [selectedItemId, setSelectedItemId] = React.useState(0);

  let functionalAcknowledgementTableData: UserProfileEducationItem[] = [] || mockedTableData;

  const {mutate: deleteEducation} = useEducationDelete();

  if (typeof employeeEducationData !== 'undefined') {
    employeeEducationData.forEach(tableData => {
      if (tableData.abbreviation === 'FUZNA') {
        functionalAcknowledgementTableData = tableData.items ? tableData.items : [];
      }
    });
  }

  const selectedItem = useMemo(() => {
    return functionalAcknowledgementTableData.find((item: UserProfileEducationItem) => item.id === selectedItemId);
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
      <TableTitleTypography variant="bodySmall" content="Funkcionalna znanja" />
      <AddIcon onClick={handleAdd}>
        <PlusIcon width={'18px'} />
      </AddIcon>
    </TableTitle>
  );

  return (
    <div>
      <TableContainer
        tableHeads={tableHeads}
        data={functionalAcknowledgementTableData}
        tableActions={[
          {name: 'edit', onClick: handleEdit, icon: <EditIconTwo stroke={Theme?.palette?.gray800} />},
          {
            name: 'edit',
            onClick: item => handleDeleteIconClick(item.id),
            icon: <TrashIconTwo stroke={Theme?.palette?.gray800} />,
          },
        ]}
        titleElement={title}></TableContainer>

      <FunctionalAcknowledgmentModal
        open={showModal}
        onClose={handleCloseModal}
        selectedItem={selectedItem}
        refetch={refetchData}
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
