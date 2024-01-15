import {Dropdown, FileUpload, Modal, Typography} from 'client-library';
import React, {useEffect, useMemo, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {ModalProps} from '../../../screens/employees/education/types';
import useGetSettings from '../../../services/graphql/settings/useGetSettings';
import useInsertEducation from '../../../services/graphql/userProfile/education/useInsertEducation';
import {educationTypes, initialValues, languageAcknowledgmentLevels} from './constants';
import {ModalContentWrapper, Row} from './styles';
import useAppContext from '../../../context/useAppContext';

export const LanguageAcknowledgmentModal: React.FC<ModalProps> = ({
  selectedItem,
  open,
  onClose,
  alert,
  refetchList,
  navigation,
}) => {
  const {settingsData} = useGetSettings({entity: educationTypes.education_language_types});
  const [files, setFiles] = useState<FileList | null>(null);
  const {
    fileService: {uploadFile},
  } = useAppContext();

  const item = useMemo(
    () =>
      selectedItem
        ? {
            ...selectedItem,
            expertise_level: {
              id: selectedItem.expertise_level || '',
              title: selectedItem?.expertise_level || '',
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
    setValue,
  } = useForm({defaultValues: item});

  const {insertEducation, loading: isSaving} = useInsertEducation();

  const handleInsertEducation = async (data: any) => {
    await insertEducation(
      data,
      () => {
        alert.success('Uspješno sačuvano.');
        refetchList && refetchList();
        onClose();
      },
      () => {
        alert.error('Greška. Promjene nisu sačuvane.');
        onClose();
      },
    );
  };

  const onSubmit = async (values: any) => {
    if (isSaving) return;

    const data = {
      id: values.id,
      title: values.title,
      date_of_certification: null,
      price: values.price,
      date_of_start: null,
      date_of_end: null,
      expertise_level: values.expertise_level.id,
      certificate_issuer: values.certificate_issuer,
      description: values.description,
      file_id: values.file_id,
      academic_title: values.academic_title?.id || '',
      type_id: values.type?.id || 0,
      user_profile_id: Number(navigation.location.pathname.split('/')[4]),
      score: '',
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

  useEffect(() => {
    item && reset(item);
  }, [item]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      style={{width: '560px'}}
      leftButtonText="Otkaži"
      rightButtonText="Sačuvaj"
      rightButtonOnClick={handleSubmit(onSubmit)}
      buttonLoading={isSaving}
      content={
        <ModalContentWrapper>
          <Row>
            <Controller
              name="type"
              rules={{required: 'Ovo polje je obavezno'}}
              control={control}
              render={({field: {onChange, name, value}}) => (
                <Dropdown
                  onChange={onChange}
                  value={value as any}
                  name={name}
                  label="STRANI JEZIK:"
                  isSearchable
                  options={settingsData}
                  error={errors.type?.message as string}
                  isRequired
                />
              )}
            />
            <Controller
              name="expertise_level"
              rules={{required: 'Ovo polje je obavezno'}}
              control={control}
              render={({field: {onChange, name, value}}) => (
                <Dropdown
                  onChange={onChange}
                  value={value as any}
                  name={name}
                  label="STEPEN:"
                  options={languageAcknowledgmentLevels}
                  error={errors.expertise_level?.message as string}
                  isRequired
                />
              )}
            />
          </Row>
          <Row>
            <FileUpload
              icon={null}
              style={{width: '510px'}}
              note={<Typography variant="bodySmall" content={''} />}
              variant="secondary"
              onUpload={handleFileUpload}
              buttonText="Učitaj"
            />
          </Row>
        </ModalContentWrapper>
      }
      title={'DODAJTE NOVI JEZIK'}
    />
  );
};
