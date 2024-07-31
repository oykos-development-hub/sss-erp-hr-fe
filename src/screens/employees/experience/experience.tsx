import {Button, EditIconTwo, Table, Theme, TrashIcon, Typography, FileIcon} from 'client-library';
import React, {useMemo, useState} from 'react';
import {ExperienceModal} from '../../../components/experienceModal/experienceModal';
import useGetOrganizationUnits from '../../../services/graphql/organizationUnits/useGetOrganizationUnits';
import useDeleteExperience from '../../../services/graphql/userProfile/experience/useDeleteExperience';
import useGetExperience from '../../../services/graphql/userProfile/experience/useGetExperience';
import {ConfirmModal} from '../../../shared/confirmModal/confirmModal';
import {ProfileExperience} from '../../../types/graphql/experience';
import {tableHeads} from './constants';
import {ExperiencePageProps} from './types';
import {FileItem} from '../../../components/fileModalView/types';
import FileModalView from '../../../components/fileModalView/fileModalView';
import {Container} from './styles';
import {checkActionRoutePermissions} from '../../../services/checkRoutePermissions.ts';

export const ExperiencePage: React.FC<ExperiencePageProps> = ({context}) => {
  const userProfileID = context.navigation.location.pathname.split('/')[4];
  const {experience, refetch, loading} = useGetExperience(+userProfileID);
  const {organizationUnits} = useGetOrganizationUnits(undefined, {allOption: true});
  const [fileToView, setFileToView] = useState<FileItem>();
  const updatePermittedRoutes = checkActionRoutePermissions(context?.contextMain?.permissions, 'update');
  const updatePermission = updatePermittedRoutes.includes('/hr/employees');

  const tableData = useMemo(() => {
    let totalYearsOfInsuredExperience = 0;
    let totalMonthsOfInsuredExperience = 0;
    let totalDaysOfInsuredExperience = 0;
    let totalYearsOfExperience = 0;
    let totalMonthsOfExperience = 0;
    let totalDaysOfExperience = 0;

    experience?.forEach((item: any) => {
      // Add current item's experience to the totals
      totalYearsOfInsuredExperience += item.years_of_insured_experience;
      totalMonthsOfInsuredExperience += item.months_of_insured_experience;
      totalDaysOfInsuredExperience += item.days_of_insured_experience;

      totalYearsOfExperience += item.years_of_experience;
      totalMonthsOfExperience += item.months_of_experience;
      totalDaysOfExperience += item.days_of_experience;

      // Adjust for overflow in days and months for insured experience
      while (totalDaysOfInsuredExperience >= 31) {
        totalDaysOfInsuredExperience -= 31;
        totalMonthsOfInsuredExperience += 1;
      }

      while (totalMonthsOfInsuredExperience >= 12) {
        totalMonthsOfInsuredExperience -= 12;
        totalYearsOfInsuredExperience += 1;
      }

      // Adjust for overflow in days and months for general experience
      while (totalDaysOfExperience >= 31) {
        totalDaysOfExperience -= 31;
        totalMonthsOfExperience += 1;
      }

      while (totalMonthsOfExperience >= 12) {
        totalMonthsOfExperience -= 12;
        totalYearsOfExperience += 1;
      }
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
          years_of_experience: totalYearsOfExperience,
          years_of_insured_experience: totalYearsOfInsuredExperience,
          months_of_experience: totalMonthsOfExperience,
          months_of_insured_experience: totalMonthsOfInsuredExperience,
          days_of_experience: totalDaysOfExperience,
          days_of_insured_experience: totalDaysOfInsuredExperience,
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
      ...tableHeads.slice(2),
    ];
  }, [organizationUnits, tableHeads]);

  const actionItems: any[] = [
    {
      name: 'showFile',
      icon: <FileIcon stroke={Theme.palette.gray600} />,
      onClick: (row: any) => {
        setFileToView(row?.file);
      },
      shouldRender: (row: any) => row?.file?.id,
    },
  ];

  if (updatePermission) {
    actionItems.push({
      name: 'Izmijeni',
      onClick: (item: any) => handleEdit(item),
      icon: <EditIconTwo stroke={Theme?.palette?.gray800} />,
      shouldRender: (item: any) => item.id !== ('' as any),
    });
    actionItems.push({
      name: 'Obriši',
      onClick: (item: any) => handleDeleteIconClick(item.id),
      icon: <TrashIcon stroke={Theme?.palette?.gray800} />,
      shouldRender: (item: any) => item.id !== ('' as any),
    });
  }

  return (
    <Container>
      {updatePermission && (
        <span>
          <Button
            variant="secondary"
            content={<Typography variant="bodyMedium" content="Dodajte novo zaposlenje" />}
            onClick={handleAdd}
          />
        </span>
      )}
      <div>
        <Table tableHeads={updatedTableHeads} data={tableData || []} isLoading={loading} tableActions={actionItems} />
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
