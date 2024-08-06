import {Datepicker, Dropdown, FileUpload, Input, Modal, Typography} from 'client-library';
import React, {useEffect, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import useAppContext from '../../context/useAppContext';
import {AbsenceTypeModalProps} from '../../screens/employees/absents/types';
import useGetOrganizationUnits from '../../services/graphql/organizationUnits/useGetOrganizationUnits';
import useInsertAbsence from '../../services/graphql/userProfile/absents/useInsertAbsence';
import {AbsenceType} from '../../types/graphql/absents';
import {
  calculateBusinessDays,
  findNextBusinessDay,
  parseDate,
  parseDateForBackend,
  parseToDate,
} from '../../utils/dateUtils';
import {dropdownOptions} from './constants';
import {FileUploadWrapper, FormGroup, ModalContentWrapper} from './styles';
import {generateDocxDocument} from './docx.ts';
import {AnnualLeaveDecisionDocumentProps} from './types.ts';
import {generateDocumentSerialNumber} from '../../utils/documentGenerationUtils.ts';
import {saveAs} from 'file-saver';
import useGetBasicInfo from '../../services/graphql/userProfile/basicInfo/useGetBasicInfo.ts';

const initialValues: any = {
  id: null,
  user_profile_id: 0,
  absent_type_id: null,
  target_organization_unit_id: null,
  date_of_start: null,
  date_of_end: null,
  description: '',
  file_id: null,
};

export const AbsentModal: React.FC<AbsenceTypeModalProps> = ({
  selectedItem,
  absenceTypes,
  open,
  onClose,
  userProfileId,
  alert,
}) => {
  const {
    fileService: {uploadFile},
    contextMain: {first_name: current_user_first_name, last_name: current_user_last_name},
  } = useAppContext();

  const [uploadedFile, setUploadedFile] = useState<FileList>();
  const [absenceChildTypes, setAbsenceChildTypes] = useState<AbsenceType[]>([]);
  const [isVacation, setIsVacation] = useState<boolean | null>(null);
  const [selectedAbsenceTypeId, setSelectedAbsenceTypeId] = useState(null);

  const handleUpload = (files: FileList) => {
    setUploadedFile(files);
  };

  const handleTypeChange = (selectedValue: any) => {
    if (selectedValue.id === 1) {
      setIsVacation(true);
      setAbsenceChildTypes([...absenceTypes.filter(item => item.accounting_days_off)]);
    } else {
      setIsVacation(false);
      setAbsenceChildTypes([...absenceTypes.filter(item => !item.accounting_days_off)]);
    }
  };

  const {organizationUnits} = useGetOrganizationUnits(undefined, {allOption: true});
  const {userBasicInfo} = useGetBasicInfo(userProfileId, {skip: !userProfileId});
  const {insertAbsence, loading: isSaving} = useInsertAbsence();
  const {first_name, last_name, organization_unit, job_position} = userBasicInfo || {};

  const handleAbsenceInsert = (data: any) => {
    insertAbsence(
      data,
      () => {
        onClose(true);
        if (isVacation) {
          const year = new Date(data.date_of_start).getFullYear();
          const documentProps: AnnualLeaveDecisionDocumentProps = {
            // currently user profile id is used as id in serial number, that will probably change
            serialNumber: generateDocumentSerialNumber(userProfileId),
            date: parseDate(new Date(), '.'),
            year,
            numberOfDays: calculateBusinessDays(data.date_of_start, data.date_of_end),
            dateOfStart: parseDate(data.date_of_start, '.'),
            dateOfEnd: parseDate(data.date_of_end, '.'),
            nextBusinessDay: parseDate(findNextBusinessDay(data.date_of_end), '.'),
            fullName: `${first_name} ${last_name}`,
            jobTitle: job_position?.title ?? '',
            department: organization_unit?.title ?? '',
            currentUser: `${current_user_first_name} ${current_user_last_name}`,
          };

          generateDocxDocument(documentProps).then((blob: any) => {
            saveAs(blob, `Rješenje_o_godišnjem_odmoru_${year}_${first_name}_${last_name}.docx`);
          });
        }
        alert.success('Uspješno sačuvano.');
        reset(initialValues);
      },
      (message: string) => {
        message === 'limit is reached'
          ? alert.error('Nije moguće kreirati rješenje o godišnjem odmoru. Nemate dovoljno preostalih slobodnih dana.')
          : alert.error('Greška. Promjene nisu sačuvane.');
      },
    );
  };

  const handleSave = async (values: any) => {
    if (isSaving) return;

    const payload = {
      id: values?.id,
      user_profile_id: userProfileId,
      date_of_start: parseDateForBackend(values?.date_of_start),
      date_of_end: parseDateForBackend(values?.date_of_end),
      absent_type_id: isVacation ? absenceChildTypes[0]?.id : values?.absent_type?.id,
      description: values?.description,
      target_organization_unit_id: values?.target_organization_unit?.id,
    };

    if (uploadedFile) {
      const formData = new FormData();
      const fileArray = Array.from(uploadedFile);

      formData.append('file', fileArray[0]);

      await uploadFile(
        formData,
        (res: any) => {
          setUploadedFile(undefined);
          const updatedData = {...payload, file_id: res[0]?.id};
          handleAbsenceInsert(updatedData);
        },
        () => {
          alert.error('Greška pri čuvanju! Fajlovi nisu učitani.');
        },
      );
    } else {
      handleAbsenceInsert(payload);
    }
  };

  const {
    register,
    handleSubmit,
    control,
    formState: {errors},
    reset,
  } = useForm({defaultValues: initialValues});

  useEffect(() => {
    if (selectedItem) {
      reset({
        ...selectedItem,
        date_of_end: parseToDate(selectedItem.date_of_end),
        date_of_start: parseToDate(selectedItem?.date_of_start),
      });
      if (selectedItem.id !== 0) {
        if (selectedItem?.absent_type.accounting_days_off) {
          setAbsenceChildTypes([...absenceTypes.filter(item => item.accounting_days_off)]);
          setIsVacation(true);
        } else {
          setAbsenceChildTypes([...absenceTypes.filter(item => !item.accounting_days_off)]);
          handleAbsenceTypeChange(selectedItem?.absent_type.title);
          setIsVacation(false);
        }
      }
    }
  }, [selectedItem, reset]);

  const handleAbsenceTypeChange = (selectedValue: any) => {
    setSelectedAbsenceTypeId(selectedValue);
  };

  const getVacationValue = () => {
    if (isVacation) {
      return dropdownOptions[1];
    } else if (isVacation === false) {
      return dropdownOptions[2];
    } else {
      return dropdownOptions[0];
    }
  };

  return (
    <Modal
      open={open}
      onClose={() => {
        onClose();
        reset(initialValues);
      }}
      leftButtonText="Otkaži"
      rightButtonText="Sačuvaj"
      rightButtonOnClick={handleSubmit(handleSave)}
      buttonLoading={isSaving}
      content={
        <ModalContentWrapper>
          <FormGroup>
            <Dropdown
              label="VRSTA ZAHTJEVA:"
              options={dropdownOptions.slice(1)}
              value={getVacationValue()}
              onChange={handleTypeChange}
              placeholder="Birajte vrstu"
              name="vacation"
            />
          </FormGroup>
          {!isVacation && (
            <FormGroup>
              <Controller
                name="absent_type"
                control={control}
                rules={{required: 'Ovo polje je obavezno'}}
                render={({field: {onChange, name, value}}) => (
                  <Dropdown
                    label="VRSTA:"
                    name={name}
                    options={absenceChildTypes}
                    value={value}
                    onChange={selectedValue => {
                      handleAbsenceTypeChange(selectedValue.title);
                      onChange(selectedValue);
                    }}
                    error={errors.absent_type?.message as string}
                    placeholder="Birajte vrstu"
                    isRequired
                  />
                )}
              />
            </FormGroup>
          )}
          {!isVacation && selectedAbsenceTypeId === 'Upućivanje u drugi državni organ' && (
            <FormGroup>
              <Controller
                name="target_organization_unit"
                control={control}
                render={({field: {onChange, name, value}}) => (
                  <Dropdown
                    label="DRŽAVNI ORGAN:"
                    name={name}
                    options={organizationUnits}
                    value={value}
                    onChange={onChange}
                    error={errors.target_organization_unit?.message as string}
                    placeholder="Birajte državni organ"
                    isRequired
                  />
                )}
              />
            </FormGroup>
          )}
          <FormGroup>
            <Controller
              name="date_of_start"
              control={control}
              rules={{required: 'Ovo polje je obavezno'}}
              render={({field: {onChange, name, value}}) => (
                <Datepicker
                  onChange={onChange}
                  label="POČETAK TRAJANJA:"
                  name={name}
                  selected={value}
                  error={errors.date_of_start?.message as string}
                  isRequired
                />
              )}
            />
          </FormGroup>
          <FormGroup>
            <Controller
              name="date_of_end"
              control={control}
              rules={{required: 'Ovo polje je obavezno'}}
              render={({field: {onChange, name, value}}) => (
                <Datepicker
                  onChange={onChange}
                  label="KRAJ TRAJANJA (Uključujuci taj dan):"
                  name={name}
                  selected={value}
                  error={errors.date_of_end?.message as string}
                  isRequired
                />
              )}
            />
          </FormGroup>

          <FormGroup>
            <Input {...register('description')} label="OPIS:" placeholder="Unesite opis..." textarea />
          </FormGroup>
          <FileUploadWrapper>
            <FileUpload
              icon={null}
              files={uploadedFile}
              variant="secondary"
              onUpload={handleUpload}
              note={<Typography variant="bodySmall" content="Zahtjevi" />}
              buttonText="Učitaj"
            />
          </FileUploadWrapper>
        </ModalContentWrapper>
      }
      title={'ZAHTJEVI'}
    />
  );
};
