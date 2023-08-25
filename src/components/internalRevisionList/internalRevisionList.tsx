import React, {useState} from 'react';
import {Table, Pagination, Divider, Dropdown, Button} from 'client-library';
import {internalRevisionTableHeads} from '../../screens/internalRevision/constants';
import {EditIconTwo, Theme, TrashIconTwo} from '@oykos-development/devkit-react-ts-styled-components';
import {DeleteModal} from '../../shared/deleteModal/deleteModal';
import {FilterContainer, MainTitle, RevisionListContainer, TableHeader} from './styles';
import {DropdownDataNumber} from '../../types/dropdownData';
import useInternalRevisionDelete from '../../services/graphql/internalRevision/useRevisionDelete';

interface InternalRevisionListProps {
  navigate: (path: string) => void;
  toggleInternalRevisionModal: (id: number) => void;
  onPageChange: (page: number) => void;
  data: any;
  total: number;
  revisorOptions: DropdownDataNumber[];
  revisorFilter: number;
  onFilter: (revisor: number) => void;
  refetchList: () => void;
  alert: any;
}

const InternalRevisionList: React.FC<InternalRevisionListProps> = ({
  data,
  onPageChange,
  toggleInternalRevisionModal,
  total,
  revisorOptions,
  revisorFilter,
  onFilter,
  refetchList,
  alert,
}) => {
  const [deleteModal, setDeleteModal] = useState(0);

  const {mutate} = useInternalRevisionDelete();

  const handleEdit = (id: number) => {
    toggleInternalRevisionModal(id);
  };

  const toggleDeleteModal = (id: number) => {
    setDeleteModal(id);
  };

  const handleDelete = () => {
    mutate(
      deleteModal,
      () => {
        toggleDeleteModal(0);
        refetchList();
        alert.success('Uspešno ste obrisali registar preporuka.');
      },
      () => {
        toggleDeleteModal(0);
        alert.error('Došlo je do greške prilikom brisanja registra preporuka.');
      },
    );
  };

  return (
    <RevisionListContainer>
      <MainTitle variant="bodyMedium" content="GODIŠNJI PLAN REVIZIJA" />
      <Divider color={Theme?.palette?.gray200} height="1px" />
      <TableHeader>
        <FilterContainer>
          <Dropdown
            name="revisor"
            value={revisorOptions.find(item => item.id === revisorFilter)}
            onChange={value => onFilter(value.id as number)}
            label="REVIZOR KOJI JE DAO PREPORUKU"
            options={[{id: 0, title: 'Svi revizori'}, ...revisorOptions]}
            placeholder="Izaberite revizora"
          />
        </FilterContainer>
        <Button content="Dodaj registar preporuka" variant="secondary" onClick={() => toggleInternalRevisionModal(0)} />
      </TableHeader>
      <Table
        tableHeads={internalRevisionTableHeads}
        data={data}
        style={{marginBottom: 22}}
        onRowClick={item => handleEdit(item.id)}
        tableActions={[
          {name: 'edit', onClick: item => handleEdit(item.id), icon: <EditIconTwo stroke={Theme?.palette?.gray800} />},
          {
            name: 'delete',
            onClick: item => toggleDeleteModal(item.id),
            icon: <TrashIconTwo stroke={Theme?.palette?.gray800} />,
          },
        ]}
      />
      <Pagination
        pageCount={Math.ceil(total / 10)}
        onChange={onPageChange}
        variant="filled"
        itemsPerPage={2}
        previousLabel="Previous"
        nextLabel="Next"
        pageRangeDisplayed={3}
      />
      <DeleteModal open={!!deleteModal} onClose={() => toggleDeleteModal(0)} handleDelete={handleDelete} />
    </RevisionListContainer>
  );
};

export default InternalRevisionList;
