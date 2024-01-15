import {Datepicker, Dropdown, FileUpload, Modal, Typography, Input} from 'client-library';
import React, {useEffect, useMemo, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {ModalProps} from '../../../screens/employees/education/types';
import useGetSettings from '../../../services/graphql/settings/useGetSettings';
import useInsertEducation from '../../../services/graphql/userProfile/education/useInsertEducation';
import {educationTypes, initialValues} from './constants';
import {FileUploadWrapper, FormGroup, ModalContentWrapper} from './styles';
import {parseDateForBackend, parseToDate} from '../../../utils/dateUtils';
import {ProfileEducationFormValues} from '../../../types/graphql/education';
import useAppContext from '../../../context/useAppContext';

export const JudicalAndStateExamsModal: React.FC<ModalProps> = ({
  selectedItem,
  open,
  onClose,
  alert,
  refetchList,
  navigation,
}) => {
  const {settingsData} = useGetSettings({entity: educationTypes.education_exam_types});
  const [files, setFiles] = useState<FileList | null>(null);
  const {
    fileService: {uploadFile},
  } = useAppContext();
  const item = useMemo(
    () =>
      selectedItem
        ? {
            ...selectedItem,
            academic_title: {
              id: selectedItem?.academic_title,
              title: selectedItem?.academic_title,
            },
          }
        : initialValues,
    [selectedItem],
  );

  const {
    handleSubmit,
    control,
    formState: {errors},
    reset,
    register,
    setValue,
    watch,
  } = useForm({defaultValues: initialValues});

  const {insertEducation, loading: isSaving} = useInsertEducation();

  useEffect(() => {
    item && reset({...item, date_of_certification: parseToDate(item.date_of_certification)});
  }, [item]);

  const handleInsertEducation = async (data: any) => {
    await insertEducation(
      data,
      () => {
        alert.success('Uspješno sačuvano.');
        refetchList && refetchList();
        onClose();
        reset(initialValues);
      },
      () => {
        alert.error('Greška. Promjene nisu sačuvane.');
        onClose();
      },
    );
  };

  const onSubmit = async (values: ProfileEducationFormValues) => {
    if (isSaving) return;

    const data = {
      id: values.id,
      title: values.title,
      date_of_certification: parseDateForBackend(values.date_of_certification),
      price: values.price,
      date_of_start: null,
      date_of_end: null,
      expertise_level: values.expertise_level,
      certificate_issuer: values.certificate_issuer,
      description: values.description,
      file_id: values.file_id,
      academic_title: values.academic_title?.id || '',
      type_id: values.type?.id || 0,
      user_profile_id: Number(navigation.location.pathname.split('/')[4]),
      score: values?.score,
    };

    if (files) {
      const formData = new FormData();
      const fileArray = Array.from(files);

      formData.append('file', fileArray[0]);

      await uploadFile(
        formData,
        (res: any) => {
          setFiles(null);
          setValue('file_id', res[0]?.id);
          const updatedData = {...data, file_id: res[0]?.id};
          handleInsertEducation(updatedData);
        },
        () => {
          alert.error('Greška pri čuvanju! Fajlovi nisu učitani.');
        },
      );
    } else {
      handleInsertEducation(data);
    }
  };

  const handleFileUpload = (files: FileList) => {
    setFiles(files);
    alert.success('Fajlovi uspješno učitani');
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
      rightButtonOnClick={handleSubmit(onSubmit)}
      buttonLoading={isSaving}
      content={
        <ModalContentWrapper>
          <FormGroup>
            <Controller
              name="type"
              rules={{required: 'Ovo polje je obavezno'}}
              control={control}
              render={({field: {onChange, name, value}}) => (
                <Dropdown
                  onChange={onChange}
                  value={value}
                  name={name}
                  label="VRSTA ISPITA"
                  options={settingsData}
                  error={errors.type?.message as string}
                  isRequired
                />
              )}
            />
          </FormGroup>
          <FormGroup>
            <Input {...register('score')} label="BROJ BODOVA:" type="number" value={watch('score')} />
          </FormGroup>
          <FormGroup>
            <Controller
              name="date_of_certification"
              control={control}
              rules={{required: 'Ovo polje je obavezno'}}
              render={({field: {onChange, name, value}}) => (
                <Datepicker
                  onChange={onChange}
                  label="DATUM POLAGANJA:"
                  name={name}
                  selected={value}
                  error={errors.date_of_certification?.message as string}
                  isRequired
                />
              )}
            />
          </FormGroup>
          <FormGroup>
            <FileUploadWrapper>
              <FileUpload
                icon={<></>}
                style={{width: '100%'}}
                variant="secondary"
                onUpload={handleFileUpload}
                note={<Typography variant="bodySmall" content="Obrazovni sertifikat" />}
                buttonText="Učitaj"
              />
            </FileUploadWrapper>
          </FormGroup>
        </ModalContentWrapper>
      }
      title={'DODAJTE NOVI PRAVOSUDNI/DRŽAVNI ISPIT'}
    />
  );
};
