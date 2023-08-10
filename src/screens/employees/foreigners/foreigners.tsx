import {EditIconTwo, Theme, TrashIcon} from '@oykos-development/devkit-react-ts-styled-components';
import {Button, Table} from 'client-library';
import React, {useState} from 'react';
import PermitEntryModal from '../../../components/permitEntryModal/permitEntryModal';
import useForeignerPermitDelete from '../../../services/graphql/foreignerPermits/useForeignerPermitDelete';
import useForeignerPermits from '../../../services/graphql/foreignerPermits/useForeignerPermitOverview';
import {DeleteModal} from '../../../shared/deleteModal/deleteModal';
import {tableHeads} from './constants';
import {ButtonContainer, TableContainer} from './styles';
import {ForeignersProps} from './types';

const Foreigners: React.FC<ForeignersProps> = ({context}) => {
  const [entryModal, setEntryModal] = useState(false);
  const [editData, setEditData] = useState<any>();
  const [deleteModal, setDeleteModal] = useState(0);

  const {data, refetch} = useForeignerPermits(3);
  const {mutate: deleteEntry} = useForeignerPermitDelete();

  const openModal = () => {
    setEntryModal(true);
  };

  const closeModal = () => {
    setEntryModal(false);
    setEditData(null);
  };

  const handleDelete = () => {
    if (deleteModal) {
      deleteEntry(
        deleteModal,
        () => {
          setDeleteModal(0);
          refetch();
          context.alert.success('Dozvola uspješno obrisana');
          // setAlert({message: 'Dozvola uspješno obrisano', variant: AlertVariants.success});
        },
        () => {
          setDeleteModal(0);
          context.alert.error('Došlo je do greške pri brisanju dozvole');
          // setAlert({message: 'Došlo je do greške pri brisanju dozvole', variant: AlertVariants.error});
        },
      );
    }
  };

  const handleEdit = (row: any) => {
    setEditData(row);
    openModal();
  };

  const toggleDeleteModal = (id: number) => {
    setDeleteModal(id);
  };

  return (
    <TableContainer>
      <ButtonContainer>
        <Button content="Dodaj novi unos" onClick={openModal} variant="secondary" />
      </ButtonContainer>
      <Table
        tableHeads={tableHeads}
        data={data.items}
        tableActions={[
          {
            name: 'edit',
            onClick: item => handleEdit(item),
            icon: <EditIconTwo stroke={Theme?.palette?.gray800} />,
          },
          {
            name: 'delete',
            onClick: item => toggleDeleteModal(item.id),
            icon: <TrashIcon stroke={Theme?.palette?.gray800} />,
          },
        ]}
      />
      <PermitEntryModal
        countries={context.countries}
        open={entryModal}
        onClose={closeModal}
        permitData={editData}
        refetchList={refetch}
        alert={context.alert}
      />
      <DeleteModal open={!!deleteModal} onClose={() => toggleDeleteModal(0)} handleDelete={handleDelete} />
    </TableContainer>
  );
};

export default Foreigners;
