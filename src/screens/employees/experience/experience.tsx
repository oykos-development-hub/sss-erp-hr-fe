import React, {useMemo, useState} from 'react';
import {Typography, Button, Table, TableHead, EditIconTwo, TrashIcon, Theme} from 'client-library';
import {ExperiencePageProps, UnitType} from './types';
import {ExperienceModal} from '../../../components/experienceModal/experienceModal';
import {Container} from './styles';
import useOrganizationUnits from '../../../services/graphql/organizationUnits/useOrganizationUnits';
import {DeleteModal} from '../../../shared/deleteModal/deleteModal';
import {UserProfileExperience} from '../../../types/graphql/userProfileGetExperienceTypes';
import useExperience from '../../../services/graphql/userProfile/experience/useExperienceOverview';
import useExperienceDelete from '../../../services/graphql/userProfile/experience/useExperienceDelete';
import {tableHeads} from './constants';

export const ExperiencePage: React.FC<ExperiencePageProps> = ({context}) => {
  const userProfileID = context.navigation.location.pathname.split('/')[3];
  const {experienceData, refetchData} = useExperience(userProfileID);
  const {organizationUnits} = useOrganizationUnits(context);

  const tableData = useMemo(() => {
    let totalInsuredExperience = 0;
    let totalExperience = 0;

    experienceData?.forEach((item: any) => {
      totalExperience += item.amount_of_experience;
      totalInsuredExperience += item.amount_of_insured_experience;
    });

    return (
      experienceData && [
        ...experienceData,
        {
          id: '',
          relevant: 'hide',
          organization_unit: '',
          date_of_start: '',
          date_of_end: '',
          amount_of_insured_experience: (
            <Typography variant="bodyMedium" style={{fontWeight: 600}} content={totalInsuredExperience} />
          ),
          amount_of_experience: <Typography variant="bodyMedium" style={{fontWeight: 600}} content={totalExperience} />,
          reference_file_id: '',
          TABLE_ACTIONS: '',
        } as any,
      ]
    );
  }, [experienceData]);

  const [showModal, setShowModal] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(0);

  const selectedItem = useMemo(() => {
    return tableData?.find((item: UserProfileExperience) => item.id === selectedItemId);
  }, [selectedItemId]);

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const {mutate} = useExperienceDelete(
    () => {
      refetchData();
      context.alert.success('Podaci su uspješno obrisani');
    },
    () => {
      context.alert.error('Greška prilikom brisanja');
    },
  );

  const handleEdit = (item: UserProfileExperience) => {
    setSelectedItemId(item.id);
    setShowModal(true);
  };
  const handleDeleteIconClick = (id: number) => {
    setShowDeleteModal(true);
    setSelectedItemId(id);
  };
  const handleAdd = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedItemId(0);
  };

  const handleDelete = () => {
    mutate(selectedItemId);
    setShowDeleteModal(false);
    setSelectedItemId(0);
  };

  const organizationUnitsList = useMemo(() => {
    return organizationUnits
      .filter(i => !i.parent_id)
      .map(unit => {
        return {id: unit.id, title: unit.title};
      });
  }, [organizationUnits]);

  return (
    <Container>
      <span>
        <Button
          variant="secondary"
          content={<Typography variant="bodyMedium" content="Dodajte novo zaposlenje" />}
          onClick={handleAdd}
        />
      </span>
      <div>
        <Table
          tableHeads={tableHeads}
          data={tableData || []}
          tableActions={[
            {
              name: 'edit',
              onClick: item => handleEdit(item),
              icon: <EditIconTwo stroke={Theme?.palette?.gray800} />,
              shouldRender: item => item.id !== ('' as any),
            },
            {
              name: 'delete',
              onClick: item => handleDeleteIconClick(item.id),
              icon: <TrashIcon stroke={Theme?.palette?.gray800} />,
              shouldRender: item => item.id !== ('' as any),
            },
          ]}
        />
      </div>
      <ExperienceModal
        alert={context.alert}
        refetchList={refetchData}
        open={showModal}
        onClose={closeModal}
        selectedItem={selectedItem}
        units={organizationUnitsList as UnitType[]}
        userProfileId={userProfileID}
      />
      <DeleteModal open={showDeleteModal} onClose={() => setShowDeleteModal(false)} handleDelete={handleDelete} />
    </Container>
  );
};
