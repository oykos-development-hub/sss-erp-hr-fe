import {EditIconTwo, Theme, TrashIcon} from '@oykos-development/devkit-react-ts-styled-components';
import {Button, Table} from 'client-library';
import React, {useState} from 'react';
import PermitEntryModal from '../../../components/permitEntryModal/permitEntryModal';
import {ConfirmModal} from '../../../shared/confirmModal/confirmModal';
import {ForeignerPermit} from '../../../types/graphql/foreignerPermits';
import {tableHeads} from './constants';
import {ButtonContainer, TableContainer} from './styles';
import {ForeignersProps} from './types';
import useGetForeignerPermits from '../../../services/graphql/foreignerPermits/useGetForeignerPermits';
import useDeleteForeignerPermit from '../../../services/graphql/foreignerPermits/useDeleteForeignerPermit';

const Foreigners: React.FC<ForeignersProps> = ({context}) => {
  const [entryModal, setEntryModal] = useState(false);
  const [editData, setEditData] = useState<ForeignerPermit | undefined>();
  const [deleteModal, setDeleteModal] = useState(0);
  const id = Number(context?.navigation.location.pathname.split('/')[4]);

  const {foreignerPermits, refetch, loading} = useGetForeignerPermits(id);
  const {mutate: deleteEntry} = useDeleteForeignerPermit();

  const openModal = () => {
    setEntryModal(true);
  };

  const closeModal = () => {
    setEntryModal(false);
    setEditData(undefined);
  };

  const handleDelete = () => {
    if (deleteModal) {
      deleteEntry(
        deleteModal,
        () => {
          setDeleteModal(0);
          refetch();
          context.alert.success('Uspješno obrisano.');
        },
        () => {
          setDeleteModal(0);
          context.alert.error('Greška. Brisanje nije moguće.');
        },
      );
    }
  };

  const handleEdit = (row: ForeignerPermit) => {
    setEditData(row);
    openModal();
  };

  const toggleDeleteModal = (id: number) => {
    setDeleteModal(id);
  };

  return (
    <TableContainer>
      <ButtonContainer>
        <Button content="Dodaj radnu dozvolu" onClick={openModal} variant="secondary" />
      </ButtonContainer>
      <Table
        tableHeads={tableHeads}
        data={foreignerPermits}
        isLoading={loading}
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
        id={id}
      />
      <ConfirmModal open={!!deleteModal} onClose={() => toggleDeleteModal(0)} handleConfirm={handleDelete} />
    </TableContainer>
  );
};

export default Foreigners;
