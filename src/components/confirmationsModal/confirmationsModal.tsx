import {yupResolver} from '@hookform/resolvers/yup';
import {Datepicker, Dropdown, FileUpload, Input, Modal, Typography} from 'client-library';
import React, {useEffect, useMemo, useState} from 'react';
import {Controller, Form, useForm} from 'react-hook-form';
import * as yup from 'yup';
import {ConfirmationsModalProps} from '../../screens/employees/confirmations/types';
import useInsertResolution from '../../services/graphql/userProfile/resolution/useInsertResolution';
import {DropdownDataNumber} from '../../types/dropdownData';
import {parseDateForBackend, parseToDate} from '../../utils/dateUtils';
import {FileUploadWrapper, FormGroup, ModalContentWrapper, UploadedFileContainer, UploadedFileWrapper} from './styles';
import useGetSettings from '../../services/graphql/settings/useGetSettings';
import {resolutionTypes} from '../education/modals/constants';
import {yesOrNoOptionsString} from '../../constants';

const confirmationSchema = yup.object().shape({
  resolution_purpose: yup.string(),
  date_of_start: yup.date().required('Ovo polje je obavezno'),
  resolution_type: yup.object().required('Ovo polje je obavezno'),
  is_affect: yup.object().default(undefined).shape({id: yup.string(), title: yup.string()}),
});

export const ConfirmationsModal: React.FC<ConfirmationsModalProps> = ({
  selectedItem,
  open,
  onClose,
  userProfileId,
  alert,
}) => {
  const {
    register,
    handleSubmit,
    control,
    formState: {errors},
    reset,
  } = useForm({
    resolver: yupResolver(confirmationSchema),
  });

  const {settingsData} = useGetSettings({entity: resolutionTypes.resolution_types});

  const resolutionTypesOptions = useMemo(() => {
    return settingsData?.slice(1, 3).filter(setting => ({id: setting?.id as number, title: setting?.title} || []));
  }, [settingsData]);

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const handleUpload = (files: FileList) => {
    const fileList = Array.from(files);
    setUploadedFiles(fileList);
  };

  const {insertResolution, loading: isSaving} = useInsertResolution();

  const handleSave = (value: any) => {
    if (isSaving) return;

    const payload = {
      ...value,
      id: value?.id || 0,
      user_profile_id: Number(userProfileId),
      date_of_start: parseDateForBackend(value?.date_of_start),
      date_of_end: null,
      file_id: value?.file_id || 0,
      resolution_purpose: value?.resolution_purpose || '',
      resolution_type_id: value?.resolution_type.id || null,
      is_affect: value?.is_affect?.id === 'Da' ? true : false,
    };

    delete payload.created_at;
    delete payload.updated_at;
    delete payload.resolution_type;
    delete payload.user_profile;

    insertResolution(
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

  useEffect(() => {
    if (selectedItem) {
      reset({
        ...selectedItem,
        date_of_end: parseToDate(selectedItem?.date_of_end),
        date_of_start: parseToDate(selectedItem?.date_of_start),
        is_affect: {id: selectedItem?.is_affect ? 'Da' : 'Ne', title: selectedItem?.is_affect ? 'Da' : 'Ne'},
      });
    }
  }, [selectedItem]);

  return (
    <Modal
      open={open}
      onClose={() => {
        reset();
        onClose();
      }}
      leftButtonText="Otkaži"
      rightButtonText="Sačuvaj"
      rightButtonOnClick={handleSubmit(handleSave)}
      buttonLoading={isSaving}
      content={
        <ModalContentWrapper>
          <FormGroup>
            {resolutionTypesOptions && (
              <Controller
                name="resolution_type"
                control={control}
                render={({field: {onChange, name, value}}) => (
                  <Dropdown
                    label="VRSTA:"
                    name={name}
                    options={resolutionTypesOptions as DropdownDataNumber[]}
                    value={value as any}
                    onChange={onChange}
                    error={errors.resolution_type?.message}
                    placeholder="Birajte vrstu"
                  />
                )}
              />
            )}
          </FormGroup>
          <FormGroup>
            <Controller
              name="is_affect"
              control={control}
              render={({field: {onChange, name, value}}) => {
                return (
                  <Dropdown
                    onChange={onChange}
                    value={value as any}
                    name={name}
                    label="PRAVOSNAŽNOST:"
                    options={yesOrNoOptionsString}
                    error={errors.is_affect?.message}
                    placeholder="Izaberite pravosnažnost:"
                  />
                );
              }}
            />
          </FormGroup>
          <FormGroup>
            <Controller
              name="date_of_start"
              control={control}
              render={({field: {onChange, name, value}}) => (
                <Datepicker
                  onChange={onChange}
                  label="DATUM RJEŠENJA/POTVRDE:"
                  name={name}
                  selected={value}
                  error={errors.date_of_start?.message}
                />
              )}
            />
          </FormGroup>

          <FormGroup>
            <Input {...register('resolution_purpose')} label="SVRHA:" placeholder="Unesite opis..." textarea />
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

          {!!uploadedFiles.length && (
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
