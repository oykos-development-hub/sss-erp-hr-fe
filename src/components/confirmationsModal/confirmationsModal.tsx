import {Datepicker, Dropdown, FileUpload, Input, Modal, Typography} from 'client-library';
import React, {useEffect, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {ConfirmationsModalProps} from '../../screens/employees/confirmations/types';
import useResolutionInsert from '../../services/graphql/userProfile/resolution/useResolutionInsert';
import {DropdownDataNumber} from '../../types/dropdownData';
import {UserProfileResolutionForm, UserProfileResolutionItem} from '../../types/graphql/userProfileGetResolution';
import {FileUploadWrapper, FormGroup, ModalContentWrapper, UploadedFileContainer, UploadedFileWrapper} from './styles';
import {parseDateForBackend, parseToDate} from '../../utils/dateUtils';

const initialValues: UserProfileResolutionForm = {
  id: 0,
  user_profile_id: 0,
  resolution_purpose: '',
  date_of_start: null,
  date_of_end: null,
  file_id: 0,
  resolution_type: null,
};

export const ConfirmationsModal: React.FC<ConfirmationsModalProps> = ({
  selectedItem,
  open,
  onClose,
  userProfileId,
  alert,
}) => {
  const dropdownOptions: DropdownDataNumber[] = [
    {id: 1, title: 'Potvrde'},
    {id: 2, title: 'Rješenja'},
  ];

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const handleUpload = (files: FileList) => {
    const fileList = Array.from(files);
    setUploadedFiles(fileList);
  };

  const {mutate: saveUserProfileResolution} = useResolutionInsert();

  const handleSave = (value: any) => {
    const payload = {
      ...value,
      id: value?.id || 0,
      user_profile_id: Number(userProfileId),
      date_of_start: parseDateForBackend(value?.date_of_start),
      date_of_end: parseDateForBackend(value?.date_of_end),
      file_id: value?.file_id || 0,
      resolution_purpose: value?.resolution_purpose || '',
      resolution_type_id: value?.resolution_type.id || null,
    };

    delete payload.created_at;
    delete payload.updated_at;
    delete payload.resolution_type;
    delete payload.user_profile;

    saveUserProfileResolution(
      payload,
      () => {
        onClose(true);
        alert.success('Uspješno sačuvano.');
      },
      () => {
        onClose(true);
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
  } = useForm<UserProfileResolutionForm>({
    defaultValues: initialValues,
  });

  useEffect(() => {
    if (selectedItem) {
      reset({
        ...selectedItem,
        date_of_end: parseToDate(selectedItem?.date_of_end),
        date_of_start: parseToDate(selectedItem?.date_of_start),
      });
    }
  }, [selectedItem]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      leftButtonText="Otkaži"
      rightButtonText="Sačuvaj"
      rightButtonOnClick={handleSubmit(handleSave)}
      content={
        <ModalContentWrapper>
          <FormGroup>
            <Controller
              name="resolution_type"
              control={control}
              rules={{required: 'Ovo polje je obavezno'}}
              render={({field: {onChange, name, value}}) => (
                <Dropdown
                  label="VRSTA:"
                  name={name}
                  options={dropdownOptions}
                  value={value as any}
                  onChange={onChange}
                  error={errors.resolution_type?.message}
                  placeholder="Birajte vrstu"
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
                  label="DATUM RJEŠENJA/POTVRDE:"
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
                  label="DATUM ZAVRSETKA RJEŠENJA/POTVRDE:"
                  name={name}
                  selected={value}
                  error={errors.date_of_start?.message as string}
                />
              )}
            />
          </FormGroup>

          <FormGroup>
            <Input
              {...register('resolution_purpose', {required: 'Ovo polje je obavezno'})}
              label="SVRHA:"
              placeholder="Unesite opis..."
              textarea
              error={errors.resolution_purpose?.message as string}
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
      title={'SVRHA POTVRDE I RJEŠENJA'}
    />
  );
};
