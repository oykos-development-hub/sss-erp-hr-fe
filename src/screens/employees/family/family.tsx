import React, {useMemo, useState} from 'react';
import {Container} from './styles';
import {Typography, Button, Table, EditIcon, TrashIcon, Theme} from 'client-library';
import {FamilyPageProps} from './types';
import {FamilyMemberModal} from '../../../components/familyMemberModal/familyMemberModal';
import {tableHeads} from './constants';
import {UserProfileFamily} from '../../../types/graphql/userProfileGetFamilyTypes';
import {DeleteModal} from '../../../shared/deleteModal/deleteModal';
import useFamilyOverview from '../../../services/graphql/userProfile/family/useFamilyOverview';
import useFamilyDelete from '../../../services/graphql/userProfile/family/useFamilyDelete';

export const FamilyPage: React.FC<FamilyPageProps> = ({context}) => {
  const userProfileID = context.navigation.location.pathname.split('/')[3];
  const {familyData, refetchData} = useFamilyOverview(userProfileID);
  const [showModal, setShowModal] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(0);

  const selectedItem = useMemo(() => {
    return familyData?.find((item: UserProfileFamily) => item.id === selectedItemId);
  }, [selectedItemId]);

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const {mutate, success, error} = useFamilyDelete(() => {
    if (success) {
      refetchData();
      context.alert.success('Uspješno obrisano');
    } else if (error) {
      context.alert.error('Brisanje nije uspješno');
    }
  });

  const handleEdit = (item: any) => {
    setSelectedItemId(item.id);
    setShowModal(true);
  };

  const handleDeleteIconClick = (id: number) => {
    setShowDeleteModal(true);
    setSelectedItemId(id);
  };

  const handleDelete = () => {
    mutate(selectedItemId);
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
          data={familyData || []}
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
      <FamilyMemberModal
        open={showModal}
        onClose={handleCloseModal}
        selectedItem={selectedItem}
        countries={context?.countries}
        userProfileId={userProfileID}
        alert={context.alert}
        refetch={refetchData}
      />
      <DeleteModal open={showDeleteModal} onClose={() => setShowDeleteModal(false)} handleDelete={handleDelete} />
    </Container>
  );
};
