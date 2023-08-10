import {Typography, Modal, FileUpload, Dropdown, Datepicker, Input} from 'client-library';
import React, {useEffect, useState} from 'react';
import {FileUploadWrapper, FormGroup, ModalContentWrapper, UploadedFileContainer, UploadedFileWrapper} from './styles';
import {parseDate} from '../../utils/dateUtils';
import {Controller, useForm} from 'react-hook-form';
import {UserProfileAbsentsParams} from '../../types/graphql/profileAbsentsTypes';
import {AbsentsModalProps} from '../../screens/employees/absents/types';
import useOrganizationUnits from '../../services/graphql/organizationUnits/useOrganizationUnits';
import {dropdownAbsentsOptions, dropdownOptions, dropdownVacationOptions} from './constants';
import useAbsentInsert from '../../services/graphql/userProfile/absents/useAbsentInsert';

const initialValues: UserProfileAbsentsParams = {
  id: null,
  user_profile_id: 0,
  absent_type_id: null,
  location: '',
  target_organization_unit_id: null,
  date_of_start: '',
  date_of_end: '',
  description: '',
  file_id: null,
};

export const AbsentModal: React.FC<AbsentsModalProps> = ({selectedItem, open, onClose, userProfileId, alert}) => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isVacation, setIsVacation] = useState<boolean>(true);
  const [isSecondDropdownEnabled, setIsSecondDropdownEnabled] = useState<boolean>(false);

  const handleUpload = (files: FileList) => {
    const fileList = Array.from(files);
    setUploadedFiles(fileList);
  };

  const handleTypeChange = (selectedValue: any) => {
    if (selectedValue.id === 1) {
      setIsVacation(true);
    } else setIsVacation(false);
    setIsSecondDropdownEnabled(!!selectedValue);
  };

  const {organizationUnitsList} = useOrganizationUnits();

  const {mutate} = useAbsentInsert();

  const handleSave = (values: any) => {
    const payload = {
      ...values,
      id: values?.id,
      user_profile_id: userProfileId,
      date_of_start: parseDate(values?.date_of_start, true),
      date_of_end: parseDate(values?.date_of_end, true),
      absent_type_id: values?.absent_type_id?.id || null,
      target_organization_unit_id: values?.target_organization_unit_id?.id || null,
    };

    mutate(
      payload,
      () => {
        onClose(true);
        alert.success('Uspješno sačuvano');
      },
      () => {
        alert.error('Nije uspješno sačuvano');
      },
    );
  };

  const {
    register,
    handleSubmit,
    control,
    formState: {errors},
    reset,
    watch,
  } = useForm<UserProfileAbsentsParams>({defaultValues: selectedItem || initialValues});

  const absentType = watch('absent_type_id');

  useEffect(() => {
    if (selectedItem) {
      reset({
        ...selectedItem,
        date_of_end: new Date(selectedItem.date_of_end),
        date_of_start: new Date(selectedItem.date_of_start),
      });
      if (selectedItem.id !== 0) {
        if (dropdownVacationOptions.find(option => option.id === selectedItem.absent_type_id.id)) {
          setIsVacation(true);
        } else setIsVacation(false);

        setIsSecondDropdownEnabled(true);
      }
    }
  }, [selectedItem, reset]);

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
      content={
        <ModalContentWrapper>
          <FormGroup>
            <Dropdown
              label="VRSTA ZAHTJEVA:"
              options={dropdownOptions}
              value={isVacation ? dropdownOptions[0] : dropdownOptions[1]}
              onChange={handleTypeChange}
              placeholder="Birajte vrstu"
              name={'vacation'}
            />
          </FormGroup>

          <FormGroup>
            <Controller
              name="absent_type_id"
              control={control}
              rules={{required: 'Ovo polje je obavezno'}}
              render={({field: {onChange, name, value}}) => (
                <Dropdown
                  label="VRSTA:"
                  name={name}
                  options={isVacation ? dropdownVacationOptions : dropdownAbsentsOptions}
                  value={value as any}
                  onChange={onChange}
                  error={errors.absent_type_id?.message}
                  placeholder="Birajte vrstu"
                  isDisabled={!isSecondDropdownEnabled}
                />
              )}
            />
          </FormGroup>

          <FormGroup>
            <Controller
              name="target_organization_unit_id"
              control={control}
              render={({field: {onChange, name, value}}) => (
                <Dropdown
                  label="DRŽAVNI ORGAN:"
                  name={name}
                  options={organizationUnitsList as any}
                  value={value as any}
                  onChange={onChange}
                  error={errors.target_organization_unit_id?.message}
                  isDisabled={absentType?.id !== 5}
                  placeholder="Birajte državni organ"
                />
              )}
            />
          </FormGroup>

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
                  value={value ? parseDate(value) : ''}
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
                  label="KRAJ TRAJANJA:"
                  name={name}
                  value={value ? parseDate(value) : ''}
                  error={errors.date_of_end?.message as string}
                />
              )}
            />
          </FormGroup>

          <FormGroup>
            <Input
              {...register('description', {required: 'Ovo polje je obavezno'})}
              label="OPIS:"
              placeholder="Unesite opis..."
              textarea
              error={errors.description?.message as string}
            />
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
      title={'DODAJTE DOPUST'}
    />
  );
};
