import React, {useEffect, useMemo, useState} from 'react';
import {StyledTabs} from '../../../components/employeeDetails/styles';
import {OverviewBox} from '../../../components/employeesList/styles';
import {SystematizationDetailsPageProps} from '../types';
import {MainWrapper, FileUploadWrapper, Row, TitleWrapper, UploadWrapper} from './styles';
import {Typography, Divider, Theme, Button, Input, Dropdown, FileUpload} from 'client-library';
import {systematizationDetailsTabs} from '../constants';
import {Tab} from '@oykos-development/devkit-react-ts-styled-components';
import {Controller, FormProvider, useForm} from 'react-hook-form';
import useOrganizationUnits from '../../../services/graphql/organizationUnits/useOrganizationUnits';
import useSystematizationGetDetails from '../../../services/graphql/systematization/useSystematizationGetDetails';
import {Sectors} from './sectors';
import {Footer} from './footer';
import {PrintPage} from './printPage';
import {formatDataSaveSystematization} from '../utils';
import useDeleteOrganisationUnit from '../../../services/graphql/organizationUnits/useOrganizationUnitDelete';
import {SectorType} from '../../../types/graphql/systematizationsGetDetailsTypes';
import useSystematizationInsert from '../../../services/graphql/systematization/useSystematizationsInsert';
import {ScreenWrapper} from '../../../shared/screenWrapper/screenWrapper';
import useJobPositions from '../../../services/graphql/jobPositions/useJobPositionOverview';
import useUserProfiles from '../../../services/graphql/userProfile/useUserProfiles';
import {parseToDate} from '../../../utils/dateUtils';
import {OrganizationalUnitModal} from '../../../components/organizationUnitModal/organizationUnitModal';
import {SystematizationsInsertParams} from '../../../types/graphql/systematizationsInsertTypes';

const initialValues = {
  organization_unit: null,
  user_profile_id: Number(localStorage.getItem('user_id')),
  serial_number: '',
  description: '',
  active: 0,
  date_of_activation: null,
  sectors: [],
  file_id: 0,
};

export const SystematizationDetails: React.FC<SystematizationDetailsPageProps> = ({context}) => {
  const [activeTab, setActiveTab] = useState(1);
  const onTabChange = (tab: Tab) => {
    setActiveTab(tab.id as number);
  };

  const {data: jobPositionData} = useJobPositions('');

  const systematizationID = context?.navigation?.location?.pathname.split('/')[4];
  const {systematizationDetails, refetch: refreshData} = useSystematizationGetDetails(systematizationID);
  const isSystematizationInactive = systematizationDetails?.active === 1;

  const {organizationUnits} = useOrganizationUnits(context);

  const [showEditSectorModal, setShowEditSectorModal] = useState(false);
  const [sectorId, setSectorId] = useState<number>(0);
  const selectedSector = useMemo(() => {
    return systematizationDetails?.sectors?.find((i: SectorType) => i.id === sectorId);
  }, [sectorId]);

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const {userProfiles, refetch: refetchEmployees} = useUserProfiles({
    page: 1,
    size: 100,
    is_active: null,
    organization_unit_id: systematizationDetails?.organizationUnit?.id,
    job_position_id: null,
    type: null,
  });

  const handleUpload = (files: FileList) => {
    const fileList = Array.from(files);
    setUploadedFiles(fileList);
  };

  const organizationUnitsList = useMemo(() => {
    return organizationUnits
      .filter(i => !i.parent_id)
      .map(unit => {
        return {id: unit.id, title: unit.title};
      });
  }, [organizationUnits]);

  const {
    navigation: {navigate},
  } = context;

  const {mutate, success, error} = useSystematizationInsert((id, serial_number) => {
    if (success) {
      const route = id > 0 ? `/hr/systematization/systematization-details/${id}` : '/hr/systematization';
      navigate(route, {replace: true});

      // reset breadcrumbs
      context.breadcrumbs.remove();
      id &&
        context.breadcrumbs.add({
          name: `Sistematizacija broj ${serial_number}`,
          to: `/hr/systematization/systematization-details/${id}`,
        });

      if (systematizationDetails && systematizationDetails.id) refreshData();
      context.alert.success('Uspješno sačuvano');
    } else if (error) {
      context.alert.error('Greška. Promjene nisu sačuvane.');
    }
  });

  const {
    mutate: deleteSector,
    success: deleteSuccess,
    error: deleteError,
  } = useDeleteOrganisationUnit(() => {
    if (deleteSuccess) {
      refreshData();
      context.alert.success('Uspješno obrisano.');
    } else if (deleteError) {
      context.alert.error('Dodavanje nije uspješno');
    }
  });

  const methods = useForm({
    defaultValues: systematizationDetails || initialValues,
  });

  const handleSave = (data: SystematizationsInsertParams) => {
    const payload = formatDataSaveSystematization(data);
    mutate(payload);
  };

  const handleCloseModal = (refetch: boolean, message: string) => {
    setShowEditSectorModal(false);
  };

  const handleDeleteSector = (id: number) => {
    deleteSector(id);
  };

  const editSector = (id: number) => {
    setSectorId(id);
    setShowEditSectorModal(true);
  };

  const setSerialNumbers = (data: any) => {
    let start = 1;
    // const counter = 0;
    const updatedData = {...data};

    // const totalJobPositions = updatedData.sectors.reduce(
    //   (sum: number, sector: any) => sum + sector.job_positions.length,
    //   0,
    // );

    updatedData.sectors.forEach((sector: SectorType) => {
      sector.job_positions_organization_units.forEach(job_positions_organization_units => {
        const available_slots = job_positions_organization_units.available_slots;
        const end = start + available_slots - 1;
        const serial_number = `${start}-${end}`;
        start = end + 1;
        const payload = {
          id: job_positions_organization_units.id || 0,
          available_slots: Number(job_positions_organization_units?.available_slots) || 1,
          parent_job_position_id: 0,
          job_position_id: job_positions_organization_units?.job_position?.id,
          system_permission_id: 0,
          description: job_positions_organization_units?.description,
          requirements: job_positions_organization_units?.requirements,
          icon: '',
          systematization_id: updatedData?.id,
          parent_organization_unit_id: sector?.id,
          serial_number: serial_number,
        };
        //TODO Check if this is bff problem

        // insertJobPosition(payload, () => {
        //   counter++;
        //   if (counter === totalJobPositions) {
        //     refreshData();
        //   }
        // });
      });
    });
  };

  const refetchDataOnSectorChanged = (availableSlotsChanged?: boolean) => {
    refreshData(res => {
      if (availableSlotsChanged) {
        setSerialNumbers(res);
      }
    });
  };

  useEffect(() => {
    if (systematizationDetails) {
      methods.reset({
        ...systematizationDetails,
        date_of_activation: parseToDate(systematizationDetails.date_of_activation),
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
              tabs={systematizationDetailsTabs(Number(systematizationID))}
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
                        value={value as any}
                        name={name}
                        label="ORGANIZACIONA JEDINICA:"
                        options={organizationUnitsList as any}
                        isDisabled={systematizationDetails?.organization_unit?.id}
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
                    onUpload={handleUpload}
                    buttonText="Dodaj dokument"
                    note="Izaberite datoteku ili je prevucite ovdje"
                  />
                </FileUploadWrapper>

                <FileUploadWrapper>
                  <Typography content="Zaključni dio dokumenta" variant="bodySmall" />
                  <FileUpload
                    icon={<></>}
                    disabled={isSystematizationInactive}
                    variant="secondary"
                    onUpload={handleUpload}
                    buttonText="Dodaj dokument"
                    note="Izaberite datoteku ili je prevucite ovdje"
                  />
                </FileUploadWrapper>
              </UploadWrapper>

              {systematizationID && Number(systematizationID) > 0 && !isSystematizationInactive && (
                <Button
                  style={{height: '72px'}}
                  variant="secondary"
                  content="Dodaj odjeljenje"
                  onClick={() => setShowEditSectorModal(true)}
                />
              )}
              <Sectors
                sectors={systematizationDetails?.sectors}
                handleDeleteSector={id => handleDeleteSector(id)}
                systematizationID={systematizationDetails?.id}
                refreshData={availableSlotsChanged => refetchDataOnSectorChanged(availableSlotsChanged)}
                handleEditSector={(id: number) => editSector(id)}
                context={context}
                jobPositionData={jobPositionData?.items}
                allEmployees={userProfiles}
                activeEmployees={systematizationDetails?.active_employees}
                isInactive={isSystematizationInactive}
              />

              <FileUploadWrapper>
                <Typography content="dokument o usvajanju sistematizacije" variant="bodySmall" />
                <FileUpload
                  icon={<></>}
                  disabled={isSystematizationInactive}
                  style={{width: '100%', marginRight: 10}}
                  variant="secondary"
                  onUpload={handleUpload}
                  buttonText="Dodaj dokument"
                  note="Izaberite datoteku ili je prevucite ovdje"
                />
              </FileUploadWrapper>
            </MainWrapper>
          ) : (
            <PrintPage sectorDetails={systematizationDetails?.sectors} />
          )}

          <Footer
            activeTab={activeTab}
            handleSaveButton={methods?.handleSubmit(handleSave)}
            active={systematizationDetails?.active}
            id={Number(systematizationID)}
          />
        </FormProvider>
        {showEditSectorModal && (
          <OrganizationalUnitModal
            alert={context.alert}
            refetch={refreshData}
            open={showEditSectorModal}
            onClose={(refetch: boolean, message: string) => {
              handleCloseModal(refetch, message);
            }}
            organizationUnit={systematizationDetails?.organization_unit}
            selectedItem={selectedSector}
          />
        )}
      </OverviewBox>
    </ScreenWrapper>
  );
};
