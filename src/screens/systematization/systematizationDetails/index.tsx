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
import {FileUploadWrapper, MainWrapper, Row, TitleWrapper, StyledFileIcon, FileIconButton, Controls} from './styles';
import useGetJobPositions from '../../../services/graphql/jobPositions/useGetJobPositions';
import {JobPositionOrgUnitTableData, SystematizationDocumentProps, TableData} from './printPage/types.ts';
import {generateDocxDocument} from './printPage/docx.ts';
import {saveAs} from 'file-saver';
import {FileItem} from '../../../components/fileModalView/types.ts';
import {checkActionRoutePermissions} from '../../../services/checkRoutePermissions.ts';
import FileList from '../../../components/fileList/fileList.tsx';

const initialValues: any = {
  organization_unit: null,
  serial_number: '',
  description: '',
  active: 0,
  date_of_activation: null,
  sectors: [],
  file_ids: [],
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

  const createPermittedRoutes = checkActionRoutePermissions(contextMain.permissions, 'create');
  const updatePermittedRoutes = checkActionRoutePermissions(contextMain.permissions, 'update');
  const createPermission = createPermittedRoutes.includes('/hr/systematization');
  const updatePermission = updatePermittedRoutes.includes('/hr/systematization');

  const systematizationId = pathname.split('/')[4];

  const disableUpdate = systematizationId ? !updatePermission : !createPermission;

  const [activeTab, setActiveTab] = useState(1);
  const [showEditSectorModal, setShowEditSectorModal] = useState(false);
  const [selectedSector, setSelectedSector] = useState<SectorType>();

  const [files, setFiles] = useState<FileList | null>(null);
  const [initialFiles, setInitialFiles] = useState<FileItem[]>([]);  
  const [showFileUploadError, setShowFileUploadError] = useState<boolean>(false);

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

  const methods = useForm({
    defaultValues: {...initialValues, user_profile_id: contextMain?.id},
  });
  const organizationUnit = methods?.watch('organization_unit');

  const {
    fileService: {uploadFile, deleteFile},
  } = useAppContext();

  const handleMutate = (data: InsertSystematizationParams) => {
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
  };

  const handleSave = async (data: InsertSystematizationParams) => {
    if (activeTab === 1) {
      data.file_ids = initialFiles.map(file => file.id);
      
      const hasFiles = (files?.length && files.length > 0);

      if (hasFiles) {
        setShowFileUploadError(false);

        const fileArray = Array.from(files);

        for (const file of fileArray) {
          const formData = new FormData();

          formData.append('file', file);

          await uploadFile(
            formData,
            (res: any) => {
              data.file_ids.push(res[0]?.id);
            },
            () => {
              alert.error('Greška pri čuvanju! Fajlovi nisu učitani.');
            },
          );
        }

        setFiles(null);
        deleteFiles();
      }
      
      handleMutate(data);
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
    setSelectedSector(undefined);
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
    const sector = systematizationDetails?.sectors?.find((i: SectorType) => i.id === id);
    if (sector) {
      setSelectedSector(sector);
    }

    setShowEditSectorModal(true);
  };

  const onTabChange = (tab: Tab) => {
    setActiveTab(tab.id as number);
  };

  const handleFileUpload = (files: FileList) => {
    setFiles(files);
    if (files.length > 0) {
      alert.success('Fajlovi uspješno učitani');
    }
  };

  const onFileRemove = (id: number) => {
    setInitialFiles(files => files.filter(file => file.id !== id));
  };

  const deleteFiles = async () => {
    for (const file of (systematizationDetails?.files) || []) {
      const fileDeleted = !initialFiles.some(file2 => file2.id === file.id);
      if (fileDeleted) {
        await deleteFile(
          file.id, 
        );
      }
    }
  };

  useEffect(() => {
    if (systematizationDetails) {
      methods.reset({
        ...systematizationDetails,
        date_of_activation: parseToDate(systematizationDetails.date_of_activation),
        user_profile_id: contextMain?.id,
      });

      refetchEmployees();

      setInitialFiles(systematizationDetails.files);
    }
  }, [systematizationDetails]);

  const handleShowError = (errorMessage: boolean) => {
    setShowFileUploadError(errorMessage);
  };

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
                  disabled={disableUpdate}
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
                        options={organizationUnits.slice(1)}
                        isDisabled={!!systematizationDetails?.organization_unit?.id}
                        isRequired
                        error={methods?.formState?.errors.organization_unit?.message as string}
                      />
                    );
                  }}
                />
              </Row>

              {!disableUpdate && systematizationId && +systematizationId > 0 && !isSystematizationInactive && (
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
                disableUpdate={disableUpdate}
              />

              {!disableUpdate && (
                <FileUploadWrapper>
                  <FileUpload
                    icon={<></>}
                    style={{width: '100%'}}
                    variant="secondary"
                    onUpload={handleFileUpload}
                    note={<Typography variant="bodySmall" content="Dokument o usvajanju sistematizacije" />}
                    buttonText="Učitaj"
                    files={files}
                    multiple={true}
                  />
                </FileUploadWrapper>
              )}
              {initialFiles && (
                <div style={{alignSelf: 'start'}}>
                  <FileList onDelete={onFileRemove} files={initialFiles} />
                </div>
              )}
            </MainWrapper>
          ) : (
            <PrintPage sectorDetails={systematizationDetails?.sectors ?? []} />
          )}

          <Footer
            activeTab={activeTab}
            handleSaveButton={methods?.handleSubmit(handleSave)}
            status={systematizationDetails?.active}
            id={+systematizationId}
            uploadedFile={files || undefined}
            setError={handleShowError}
            file={systematizationDetails?.files?.[0]?.id}
            disableUpdate={activeTab === 1 && disableUpdate}
          />
        </FormProvider>
        {!disableUpdate && showEditSectorModal && (
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
