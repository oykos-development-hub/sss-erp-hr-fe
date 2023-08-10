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
  id: 0,
  user_profile_id: 0,
  date_of_start: '',
  date_of_end: '',
  file_id: 0,
  target_organization_unit: null,
  target_organization_unit_id: 0,
  location: '',
  description: '',
  vacation_type: null,
  vacation_type_id: 0,
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

  const {mutate: saveUserProfileAbsents} = useAbsentInsert();

  const handleSave = (values: any) => {
    const payload = {
      ...values,
      id: values?.id || 0,
      user_profile_id: userProfileId,
      date_of_start: values?.date_of_start.toISOString() || '',
      date_of_end: values?.date_of_end.toISOString() || '',
      file_id: values?.file_id || 1,
      vacation_type_id: values?.vacation_type?.id || null,
      location: values?.location || '',
      target_organization_unit_id: values?.target_organization_unit?.id || 0,
    };

    delete payload.vacation_type;
    delete payload.created_at;
    delete payload.updated_at;
    delete payload.target_organization_unit;

    saveUserProfileAbsents(
      payload,
      () => {
        onClose(true);
        alert.success('Uspješno sačuvano');
      },
      () => {
        onClose(false);
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

  const vacationType = watch('vacation_type');

  useEffect(() => {
    if (selectedItem) {
      reset({
        ...selectedItem,
        date_of_end: new Date(selectedItem.date_of_end),
        date_of_start: new Date(selectedItem.date_of_start),
      });
      if (selectedItem.id !== 0) {
        if (dropdownVacationOptions.find(option => option.id === selectedItem.vacation_type.id)) {
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
              name="vacation_type"
              control={control}
              rules={{required: 'Ovo polje je obavezno'}}
              render={({field: {onChange, name, value}}) => (
                <Dropdown
                  label="VRSTA:"
                  name={name}
                  options={isVacation ? dropdownVacationOptions : dropdownAbsentsOptions}
                  value={value as any}
                  onChange={onChange}
                  error={errors.vacation_type?.message}
                  placeholder="Birajte vrstu"
                  isDisabled={!isSecondDropdownEnabled}
                />
              )}
            />
          </FormGroup>

          <FormGroup>
            <Controller
              name="target_organization_unit"
              control={control}
              render={({field: {onChange, name, value}}) => (
                <Dropdown
                  label="DRŽAVNI ORGAN:"
                  name={name}
                  options={organizationUnitsList as any}
                  value={value as any}
                  onChange={onChange}
                  error={errors.target_organization_unit?.message}
                  isDisabled={vacationType?.id !== 5}
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
