import React, {useMemo, useState} from 'react';
import {Container} from './styles';
import {Typography, Button, Table, EditIcon, TrashIcon, Theme} from 'client-library';
import {FamilyPageProps} from './types';
import {FamilyMemberModal} from '../../../components/familyMemberModal/familyMemberModal';
import {tableHeads} from './constants';
import {ConfirmModal} from '../../../shared/confirmModal/confirmModal';
import useGetFamily from '../../../services/graphql/userProfile/family/useGetFamily';
import useDeleteFamily from '../../../services/graphql/userProfile/family/useDeleteFamily';
import {ProfileFamily} from '../../../types/graphql/family';

export const FamilyPage: React.FC<FamilyPageProps> = ({context}) => {
  const userProfileID = context.navigation.location.pathname.split('/')[4];
  const {family, refetch, loading} = useGetFamily(userProfileID);
  const [showModal, setShowModal] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(0);

  const selectedItem = useMemo(() => {
    return family?.find((item: ProfileFamily) => item.id === selectedItemId);
  }, [selectedItemId]);

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const {deleteFamily} = useDeleteFamily();

  const handleEdit = (item: any) => {
    setSelectedItemId(item.id);
    setShowModal(true);
  };

  const handleDeleteIconClick = (id: number) => {
    setShowDeleteModal(true);
    setSelectedItemId(id);
  };

  const handleDelete = () => {
    deleteFamily(
      selectedItemId,
      () => {
        refetch();
        context.alert.success('Uspješno obrisano.');
      },
      () => {
        context.alert.error('Greška. Brisanje nije moguće.');
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

  return (
    <Container>
      <span>
        <Button
          variant="secondary"
          content={<Typography variant="bodyMedium" content="Dodajte člana porodice" />}
          onClick={handleAdd}
        />
      </span>
      <div>
        <Table
          tableHeads={tableHeads}
          data={family || []}
          isLoading={loading}
          tableActions={[
            {
              name: 'edit',
              onClick: item => handleEdit(item),
              icon: <EditIcon stroke={Theme?.palette?.gray800} />,
            },
            {
              name: 'delete',
              onClick: item => handleDeleteIconClick(item.id),
              icon: <TrashIcon stroke={Theme?.palette?.gray800} />,
            },
          ]}
        />
      </div>
      {showModal && (
        <FamilyMemberModal
          open={true}
          onClose={handleCloseModal}
          selectedItem={selectedItem}
          countries={context?.countries}
          userProfileId={userProfileID}
          alert={context.alert}
          refetch={refetch}
        />
      )}

      <ConfirmModal open={showDeleteModal} onClose={() => setShowDeleteModal(false)} handleConfirm={handleDelete} />
    </Container>
  );
};
