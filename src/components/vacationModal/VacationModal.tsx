import {Dropdown, FileUpload, Input, Modal, Typography} from 'client-library';
import React, {useEffect, useMemo, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {VacationModalProps} from '../../screens/employees/absents/types';
import useVacationInsert from '../../services/graphql/userProfile/vacation/useInsertVacation';
import {yearsForDropdown} from '../../utils/constants';
import {FileUploadWrapper, FormGroup, ModalContentWrapper, UploadedFileContainer, UploadedFileWrapper} from './styles';
import {ProfileVacationParams} from '../../types/graphql/vacations';

const initialValues: ProfileVacationParams = {
  id: null,
  user_profile_id: null,
  file_id: null,
  number_of_days: null,
  year: null,
  resolution_purpose: '',
};

export const VacationModal: React.FC<VacationModalProps> = ({selectedItem, open, onClose, userProfileId, alert}) => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const handleUpload = (files: FileList) => {
    const fileList = Array.from(files);
    setUploadedFiles(fileList);
  };

  const {insertVacation, loading} = useVacationInsert();

  const handleSave = (values: any) => {
    const payload = {
      id: values.id,
      user_profile_id: userProfileId,
      year: values.year.id || 0,
      file_id: values.file_id,
      number_of_days: values.number_of_days,
      resolution_purpose: values.resolution_purpose,
    };

    insertVacation(
      payload,
      () => {
        onClose(true);
        alert.success('Uspješno sačuvano.');
        reset();
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
  } = useForm<any>({defaultValues: initialValues});

  useEffect(() => {
    reset({...selectedItem, year: yearOptions.find(yearOption => yearOption.id === selectedItem?.year)});
  }, [selectedItem]);

  const yearOptions = useMemo(() => [...yearsForDropdown().map(year => ({id: +year.id, title: +year.title}))], []);

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
      buttonLoading={loading}
      content={
        <ModalContentWrapper>
          <FormGroup>
            <Controller
              name="year"
              control={control}
              rules={{required: 'Ovo polje je obavezno'}}
              render={({field: {onChange, name, value}}) => (
                <Dropdown
                  label="GODINA:"
                  name={name}
                  options={yearOptions}
                  value={value as any}
                  onChange={onChange}
                  error={errors.year?.message as string}
                />
              )}
            />
          </FormGroup>

          <FormGroup>
            <Input
              {...register('number_of_days', {required: 'Ovo polje je obavezno'})}
              label="UKUPAN BROJ DANA:"
              error={errors.number_of_days?.message as string}
            />
          </FormGroup>
          <FormGroup>
            <Input {...register('resolution_purpose')} label="OPIS:" textarea />
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
      title={'Rješenje o godišnjem odmoru'}
    />
  );
};
