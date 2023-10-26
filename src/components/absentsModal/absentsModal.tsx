import {Datepicker, Dropdown, FileUpload, Input, Modal, Typography} from 'client-library';
import React, {useEffect, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {AbsenceTypeModalProps} from '../../screens/employees/absents/types';
import useGetOrganizationUnits from '../../services/graphql/organizationUnits/useGetOrganizationUnits';
import useInsertAbsence from '../../services/graphql/userProfile/absents/useInsertAbsence';
import {AbsenceParams, AbsenceType} from '../../types/graphql/absents';
import {parseDateForBackend, parseToDate} from '../../utils/dateUtils';
import {dropdownOptions} from './constants';
import {FileUploadWrapper, FormGroup, ModalContentWrapper, UploadedFileContainer, UploadedFileWrapper} from './styles';

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
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [absenceChildTypes, setAbsenceChildTypes] = useState<AbsenceType[]>([]);
  const [isVacation, setIsVacation] = useState<boolean | null>(null);
  const [selectedAbsenceTypeId, setSelectedAbsenceTypeId] = useState(null);

  const handleUpload = (files: FileList) => {
    const fileList = Array.from(files);
    setUploadedFiles(fileList);
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

  const {insertAbsence, loading: isSaving} = useInsertAbsence();

  const handleSave = (values: any) => {
    if (isSaving) return;
    const payload = {
      id: values?.id || 0,
      user_profile_id: userProfileId,
      date_of_start: parseDateForBackend(values?.date_of_start),
      date_of_end: parseDateForBackend(values?.date_of_end),
      absent_type_id: isVacation ? absenceChildTypes[0]?.id : values?.absent_type?.id,
      description: values?.description,
      target_organization_unit_id: values?.target_organization_unit?.id || null,
      file_id: values?.file_id || null,
    };

    insertAbsence(
      payload,
      () => {
        onClose(true);
        alert.success('Uspješno sačuvano.');
        reset(initialValues);
      },
      () => {
        alert.error('Greška. Promjene nisu sačuvane.');
      },
    );
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
                />
              )}
            />
          </FormGroup>

          <FormGroup>
            <Input {...register('description')} label="OPIS:" placeholder="Unesite opis..." textarea />
          </FormGroup>
          <FileUploadWrapper>
            <FileUpload
              icon={<></>}
              style={{width: '100%'}}
              variant="secondary"
              onUpload={handleUpload}
              note={<Typography variant="bodySmall" content="Validacija" />}
              buttonText="Učitaj"
            />
          </FileUploadWrapper>
          {uploadedFiles.length > 0 && (
            <UploadedFileWrapper>
              {uploadedFiles.map((file, index) => (
                <UploadedFileContainer key={index}>
                  <Typography variant="bodySmall" content={file.name} />
                </UploadedFileContainer>
              ))}
            </UploadedFileWrapper>
          )}
        </ModalContentWrapper>
      }
      title={'ZAHTJEVI'}
    />
  );
};
