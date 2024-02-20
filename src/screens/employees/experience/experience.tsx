import {Button, EditIconTwo, Table, Theme, TrashIcon, Typography, FileIcon} from 'client-library';
import React, {useMemo, useState} from 'react';
import {ExperienceModal} from '../../../components/experienceModal/experienceModal';
import useGetOrganizationUnits from '../../../services/graphql/organizationUnits/useGetOrganizationUnits';
import useDeleteExperience from '../../../services/graphql/userProfile/experience/useDeleteExperience';
import useGetExperience from '../../../services/graphql/userProfile/experience/useGetExperience';
import {ConfirmModal} from '../../../shared/confirmModal/confirmModal';
import {ProfileExperience} from '../../../types/graphql/experience';
import {formatExperience, tableHeads} from './constants';
import {ExperiencePageProps} from './types';
import {FileItem} from '../../../components/fileModalView/types';
import FileModalView from '../../../components/fileModalView/fileModalView';
import {Container} from './styles';

export const ExperiencePage: React.FC<ExperiencePageProps> = ({context}) => {
  const userProfileID = context.navigation.location.pathname.split('/')[4];
  const {experience, refetch, loading} = useGetExperience(+userProfileID);
  const {organizationUnits} = useGetOrganizationUnits(undefined, {allOption: true});
  const [fileToView, setFileToView] = useState<FileItem>();

  const tableData = useMemo(() => {
    let totalInsuredExperience = 0;
    let totalExperience = 0;

    experience?.forEach((item: any) => {
      totalExperience += item.amount_of_experience;
      totalInsuredExperience += item.amount_of_insured_experience;
      console.log(totalExperience, 'experience');
    });

    return (
      experience && [
        ...experience,
        {
          id: '',
          relevant: 'hide',
          organization_unit: '',
          date_of_start: '',
          date_of_end: '',
          amount_of_insured_experience: (
            <Typography variant="bodyMedium" style={{fontWeight: 600}} content={totalInsuredExperience} />
          ),
          amount_of_experience: totalExperience,
          reference_file_id: '',
          TABLE_ACTIONS: '',
        } as any,
      ]
    );
  }, [experience]);

  const [showModal, setShowModal] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(0);

  const selectedItem = useMemo(() => {
    return tableData?.find((item: ProfileExperience) => item.id === selectedItemId);
  }, [selectedItemId]);

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const {deleteExperience} = useDeleteExperience();

  const handleEdit = (item: ProfileExperience) => {
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
    deleteExperience(
      selectedItemId,
      () => {
        refetch();
        context.alert.success('Uspješno obrisano.');
        setShowDeleteModal(false);
        setSelectedItemId(0);
      },
      () => {
        context.alert.error('Greška. Brisanje nije moguće.');
      },
    );
  };

  const updatedTableHeads = useMemo(() => {
    return [
      ...tableHeads.slice(0, 1),
      {
        ...tableHeads[1],
        renderContents: (organization_unit: string, row: ProfileExperience) => {
          return (
            <Typography
              variant="bodyMedium"
              content={
                organization_unit
                  ? organization_unit
                  : organizationUnits.find(orgUnit => orgUnit.id === row.organization_unit_id)?.title || ''
              }
            />
          );
        },
      },
      ...tableHeads.slice(3),
    ];
  }, [organizationUnits, tableHeads]);

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
          tableHeads={updatedTableHeads}
          data={tableData || []}
          isLoading={loading}
          tableActions={[
            {
              name: 'showFile',
              icon: <FileIcon stroke={Theme.palette.gray600} />,
              onClick: (row: any) => {
                setFileToView(row?.file);
              },
              shouldRender: (row: any) => row?.file?.id,
            },
            {
              name: 'Izmijeni',
              onClick: item => handleEdit(item),
              icon: <EditIconTwo stroke={Theme?.palette?.gray800} />,
              shouldRender: item => item.id !== ('' as any),
            },
            {
              name: 'Obriši',
              onClick: item => handleDeleteIconClick(item.id),
              icon: <TrashIcon stroke={Theme?.palette?.gray800} />,
              shouldRender: item => item.id !== ('' as any),
            },
          ]}
        />
      </div>
      {fileToView && <FileModalView file={fileToView} onClose={() => setFileToView(undefined)} />}
      {showModal && (
        <ExperienceModal
          alert={context.alert}
          refetchList={refetch}
          open={showModal}
          onClose={closeModal}
          selectedItem={selectedItem}
          userProfileId={userProfileID}
        />
      )}

      <ConfirmModal open={showDeleteModal} onClose={() => setShowDeleteModal(false)} handleConfirm={handleDelete} />
    </Container>
  );
};
