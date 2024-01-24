import {Tab} from '@oykos-development/devkit-react-ts-styled-components';
import {Button, Divider, Dropdown, FileUpload, Input, Theme, Typography} from 'client-library';
import React, {useEffect, useMemo, useState} from 'react';
import {Controller, FormProvider, useForm} from 'react-hook-form';
import {StyledTabs} from '../../../components/employeeDetails/styles';
import {OverviewBox} from '../../../components/employeesList/styles';
import {OrganizationalUnitModal} from '../../../components/organizationUnitModal/organizationUnitModal';
import useAppContext from '../../../context/useAppContext';
import useDeleteOrganizationUnit from '../../../services/graphql/organizationUnits/useDeleteOrganizationUnit';
import useGetOrganizationUnits from '../../../services/graphql/organizationUnits/useGetOrganizationUnits';
import useGetSystematizationDetails from '../../../services/graphql/systematization/useGetSystematizationDetails';
import useSystematizationInsert from '../../../services/graphql/systematization/useInsertSystematization';
import useUserProfiles from '../../../services/graphql/userProfile/useGetUserProfiles';
import {ScreenWrapper} from '../../../shared/screenWrapper/screenWrapper';
import {
  InsertSystematizationParams,
  SectorJobPosition,
  SectorType,
  SystematizationType,
} from '../../../types/graphql/systematizationsTypes';
import {parseDate, parseToDate} from '../../../utils/dateUtils';
import {systematizationDetailsTabs} from '../constants';
import {formatSystematization} from '../utils';
import Departments from './departments/departments';
import {Footer} from './footer/footer';
import {PrintPage} from './printPage/printPage';
import {FileUploadWrapper, MainWrapper, Row, TitleWrapper, UploadWrapper} from './styles';
import useGetJobPositions from '../../../services/graphql/jobPositions/useGetJobPositions';
import {JobPositionOrgUnitTableData, SystematizationDocumentProps, TableData} from './printPage/types.ts';
import {generateDocxDocument} from './printPage/docx.ts';
import {saveAs} from 'file-saver';

const initialValues: any = {
  organization_unit: null,
  serial_number: '',
  description: '',
  active: 0,
  date_of_activation: null,
  sectors: [],
  file_id: 0,
  user_profile_id: 0,
};

export const SystematizationDetails: React.FC = () => {
  const {
    navigation: {
      navigate,
      location: {pathname},
    },
    breadcrumbs,
    contextMain,
  } = useAppContext();

  const systematizationId = pathname.split('/')[4];

  const [activeTab, setActiveTab] = useState(1);
  const [showEditSectorModal, setShowEditSectorModal] = useState(false);
  const [sectorId, setSectorId] = useState<number>(0);

  const {alert} = useAppContext();

  const {systematizationDetails, refetch} = useGetSystematizationDetails(+systematizationId);
  const {organizationUnits} = useGetOrganizationUnits(undefined, {allOption: true});
  const {jobPositions} = useGetJobPositions('');
  const {userProfiles, refetch: refetchEmployees} = useUserProfiles({
    page: 1,
    size: 100,
    is_active: null,
    organization_unit_id: systematizationDetails?.organization_unit,
    job_position_id: null,
    type: null,
  });

  const {mutate: deleteSector} = useDeleteOrganizationUnit();
  const {mutate} = useSystematizationInsert();

  const isSystematizationInactive = systematizationDetails?.active === 1;

  const selectedSector = useMemo(() => {
    return systematizationDetails?.sectors?.find((i: SectorType) => i.id === sectorId);
  }, [sectorId]);

  const methods = useForm({
    defaultValues: {...initialValues, user_profile_id: contextMain?.id},
  });
  const organizationUnit = methods?.watch('organization_unit');

  const handleSave = (data: InsertSystematizationParams) => {
    if (activeTab === 1) {
      const payload = formatSystematization(data);

      mutate(
        payload,
        (item: SystematizationType) => {
          const {id, serial_number} = item;

          const route =
            id > 0 && !systematizationId ? `/hr/systematization/systematization-details/${id}` : '/hr/systematization';
          navigate(route, {replace: true});

          // Reset breadcrumbs
          breadcrumbs.remove();

          id &&
            breadcrumbs.add({
              name: `Sistematizacija broj ${serial_number}`,
              to: `/hr/systematization/systematization-details/${id}`,
            });

          if (systematizationDetails && systematizationDetails.id) {
            refetch();
          }

          alert.success('Uspješno sačuvano');
        },
        () => {
          alert.error('Greška. Promjene nisu sačuvane.');
        },
      );
    } else if (systematizationDetails?.sectors?.length) {
      const tableData = (): TableData[] => {
        return systematizationDetails?.sectors.map((sector: SectorType) => {
          return {
            title: sector?.title ?? '',
            id: sector?.id ?? 0,
            job_positions_organization_units: sector?.job_positions_organization_units?.map(
              (jobPosition: SectorJobPosition) => {
                return {
                  available_slots: jobPosition?.available_slots ?? 0,
                  description: jobPosition?.description ?? '',
                  requirements: jobPosition?.requirements ?? '',
                  job_title: jobPosition?.job_positions?.title ?? '',
                };
              },
            ) as JobPositionOrgUnitTableData[],
          };
        });
      };

      const documentProps: SystematizationDocumentProps = {
        date: parseDate(new Date(), '.'),
        organizationUnit: organizationUnit?.title ?? '',
        tableData: tableData(),
      };

      generateDocxDocument(documentProps).then((blob: any) => {
        saveAs(blob, 'Sistematizacija.docx');
      });
    }
  };

  const handleCloseModal = () => {
    setShowEditSectorModal(false);
  };

  const handleDeleteSector = (id: number) => {
    deleteSector(
      id,
      () => {
        refetch();
        alert.success('Uspješno obrisano.');
      },
      () => {
        alert.error('Greška. Promjene nisu sačuvane.');
      },
    );
  };

  const editSector = (id: number) => {
    setSectorId(id);
    setShowEditSectorModal(true);
  };

  const onTabChange = (tab: Tab) => {
    setActiveTab(tab.id as number);
  };

  useEffect(() => {
    if (systematizationDetails) {
      methods.reset({
        ...systematizationDetails,
        date_of_activation: parseToDate(systematizationDetails.date_of_activation),
        user_profile_id: contextMain?.id,
      });
      refetchEmployees();
    }
  }, [systematizationDetails]);

  return (
    <ScreenWrapper>
      <OverviewBox>
        <FormProvider {...methods}>
          <TitleWrapper>
            <Typography
              style={{fontWeight: 600}}
              variant="bodyMedium"
              content={systematizationDetails?.organization_unit?.title?.toUpperCase() || ''}
            />
            <StyledTabs
              tabs={systematizationDetailsTabs(+systematizationId)}
              activeTab={activeTab}
              onChange={onTabChange}
              //TODO: change in devkit/library
              style={{borderWidth: '1px', borderRadius: '0.5em 0.5em 0 0', whiteSpace: 'nowrap'}}
            />
          </TitleWrapper>
          <Divider color={Theme?.palette?.gray200} height="1px" style={{margin: 0}} />
          {activeTab === 1 ? (
            <MainWrapper>
              <Row>
                <Input
                  {...methods?.register('serial_number', {required: 'Ovo polje je obavezno'})}
                  label="BROJ SISTEMATIZACIJE:"
                  isRequired
                  error={methods?.formState?.errors.serial_number?.message as string}
                />
                <Controller
                  name="organization_unit"
                  control={methods?.control}
                  rules={{required: 'Ovo polje je obavezno'}}
                  render={({field: {onChange, name, value}}) => {
                    return (
                      <Dropdown
                        onChange={onChange}
                        value={value}
                        name={name}
                        label="ORGANIZACIONA JEDINICA:"
                        options={organizationUnits}
                        isDisabled={!!systematizationDetails?.organization_unit?.id}
                        isRequired
                        error={methods?.formState?.errors.organization_unit?.message as string}
                      />
                    );
                  }}
                />
              </Row>

              <UploadWrapper>
                <FileUploadWrapper>
                  <Typography content="Uvodni dio dokumenta" variant="bodySmall" />
                  <FileUpload
                    icon={<></>}
                    disabled={isSystematizationInactive}
                    variant="secondary"
                    onUpload={() => console.log('uploading')}
                    buttonText="Dodajte dokument"
                    note="Izaberite datoteku ili je prevucite ovdje"
                  />
                </FileUploadWrapper>

                <FileUploadWrapper>
                  <Typography content="Zaključni dio dokumenta" variant="bodySmall" />
                  <FileUpload
                    icon={<></>}
                    disabled={isSystematizationInactive}
                    variant="secondary"
                    onUpload={() => console.log('uploading')}
                    buttonText="Dodajte dokument"
                    note="Izaberite datoteku ili je prevucite ovdje"
                  />
                </FileUploadWrapper>
              </UploadWrapper>

              {systematizationId && +systematizationId > 0 && !isSystematizationInactive && (
                <Button
                  style={{height: '72px'}}
                  variant="secondary"
                  content="Dodajte odjeljenje"
                  onClick={() => setShowEditSectorModal(true)}
                />
              )}

              <Departments
                sectors={systematizationDetails?.sectors ?? []}
                handleDeleteSector={id => handleDeleteSector(id)}
                systematizationId={systematizationId}
                refetchDetails={refetch}
                handleEditSector={(id: number) => editSector(id)}
                jobPositionData={jobPositions}
                allEmployees={userProfiles}
                activeEmployees={systematizationDetails?.active_employees ?? []}
                isInactive={isSystematizationInactive}
              />

              <FileUploadWrapper>
                <Typography content="dokument o usvajanju sistematizacije" variant="bodySmall" />
                <FileUpload
                  icon={<></>}
                  disabled={isSystematizationInactive}
                  style={{width: '100%', marginRight: 10}}
                  variant="secondary"
                  onUpload={() => console.log('uploading')}
                  buttonText="Dodajte dokument"
                  note="Izaberite datoteku ili je prevucite ovdje"
                />
              </FileUploadWrapper>
            </MainWrapper>
          ) : (
            <PrintPage sectorDetails={systematizationDetails?.sectors ?? []} />
          )}

          <Footer
            activeTab={activeTab}
            handleSaveButton={methods?.handleSubmit(handleSave)}
            active={systematizationDetails?.active}
            id={+systematizationId}
          />
        </FormProvider>
        {showEditSectorModal && (
          <OrganizationalUnitModal
            refetch={refetch}
            open={showEditSectorModal}
            onClose={handleCloseModal}
            organizationUnit={systematizationDetails?.organization_unit}
            selectedItem={selectedSector}
          />
        )}
      </OverviewBox>
    </ScreenWrapper>
  );
};
