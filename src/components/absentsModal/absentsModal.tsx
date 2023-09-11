import {Datepicker, Dropdown, FileUpload, Input, Modal, Typography} from 'client-library';
import React, {useEffect, useMemo, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {AbsentsModalProps} from '../../screens/employees/absents/types';
import useOrganizationUnits from '../../services/graphql/organizationUnits/useOrganizationUnits';
import useAbsentInsert from '../../services/graphql/userProfile/absents/useAbsentInsert';
import {AbsentType, UserProfileAbsentsParams} from '../../types/graphql/profileAbsentsTypes';
import {dropdownOptions, dropdownVacationOptions} from './constants';
import {FileUploadWrapper, FormGroup, ModalContentWrapper, UploadedFileContainer, UploadedFileWrapper} from './styles';
import {parseDateForBackend, parseToDate} from '../../utils/dateUtils';

const initialValues: UserProfileAbsentsParams = {
  id: null,
  user_profile_id: 0,
  absent_type_id: null,
  location: '',
  target_organization_unit_id: null,
  date_of_start: null,
  date_of_end: null,
  description: '',
  file_id: null,
};

export const AbsentModal: React.FC<AbsentsModalProps> = ({
  selectedItem,
  absentTypes,
  open,
  onClose,
  userProfileId,
  alert,
}) => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [absentChildType, setAbsentChildType] = useState<AbsentType[]>([]);
  const [isVacation, setIsVacation] = useState<boolean>(true);

  const handleUpload = (files: FileList) => {
    const fileList = Array.from(files);
    setUploadedFiles(fileList);
  };

  const handleTypeChange = (selectedValue: any) => {
    const vacation = selectedValue.id === 1;
    if (selectedValue.id === 1) {
      setIsVacation(true);
    } else setIsVacation(false);
    setAbsentChildType([...absentTypes.filter(item => item.accounting_days_off === vacation)]);
  };

  const {organizationUnits} = useOrganizationUnits();

  const organizationUnitsList = useMemo(() => {
    return organizationUnits
      .filter(i => !i.parent_id)
      .map(unit => {
        return {id: unit.id, title: unit.title};
      });
  }, [organizationUnits]);

  const {mutate, loading: isSaving} = useAbsentInsert();

  const handleSave = (values: any) => {
    if (isSaving) return;

    const payload = {
      ...values,
      id: values?.id || 0,
      user_profile_id: userProfileId,
      date_of_start: parseDateForBackend(values?.date_of_start),
      date_of_end: parseDateForBackend(values?.date_of_end),
      absent_type_id: values?.absent_type_id?.id || 0,
      target_organization_unit_id: values?.target_organization_unit_id?.id || 1,
    };

    mutate(
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
  } = useForm<UserProfileAbsentsParams>({defaultValues: selectedItem || initialValues});

  useEffect(() => {
    if (selectedItem) {
      console.log(selectedItem);
      reset({
        ...selectedItem,
        date_of_end: parseToDate(selectedItem.date_of_end),
        date_of_start: parseToDate(selectedItem.date_of_start),
      });
      if (selectedItem.id !== 0) {
        if (dropdownVacationOptions.find(option => option.id === selectedItem.absent_type_id.id)) {
          setIsVacation(true);
        } else setIsVacation(false);
      }
    }
  }, [selectedItem, reset]);

  useEffect(() => {
    setAbsentChildType([...absentTypes.filter(item => item.accounting_days_off === true)]);
  }, [absentTypes]);

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
                  options={absentChildType}
                  value={value as any}
                  onChange={onChange}
                  error={errors.absent_type_id?.message}
                  placeholder="Birajte vrstu"
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
                  placeholder="Birajte državni organ"
                  isDisabled={isVacation}
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
                  label="KRAJ TRAJANJA:"
                  name={name}
                  selected={value}
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
      title={'ZAHTJEVI'}
    />
  );
};
