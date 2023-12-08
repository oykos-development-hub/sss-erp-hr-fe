import {Dropdown, FileUpload, Input, Modal, Typography} from 'client-library';
import React, {useEffect, useMemo} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {ModalProps} from '../../../screens/employees/education/types';
import useGetSettings from '../../../services/graphql/settings/useGetSettings';
import useInsertEducation from '../../../services/graphql/userProfile/education/useInsertEducation';
import {ProfileEducationFormValues} from '../../../types/graphql/education';
import {academicTitles, educationTypes, initialValues} from './constants';
import {FileUploadWrapper, FormGroup, ModalContentWrapper} from './styles';

export const AcademicEducationModal: React.FC<ModalProps> = ({
  selectedItem,
  open,
  onClose,
  alert,
  refetchList,
  navigation,
}) => {
  const {settingsData} = useGetSettings({entity: educationTypes.education_academic_types});

  const item = useMemo(
    () =>
      selectedItem
        ? {
            ...selectedItem,
            academic_title: {id: selectedItem.academic_title, title: selectedItem.academic_title},
          }
        : initialValues,
    [selectedItem],
  );

  const {
    register,
    handleSubmit,
    control,
    formState: {errors},
    reset,
  } = useForm({defaultValues: selectedItem});

  const {insertEducation, loading: isSaving} = useInsertEducation();

  useEffect(() => {
    item && reset(item);
  }, [item]);

  const onSubmit = async (values: ProfileEducationFormValues) => {
    if (isSaving) return;

    const data = {
      id: values.id,
      title: values.title,
      date_of_certification: null,
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
      score: '',
    };

    try {
      insertEducation(
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
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <Modal
      open={open}
      onClose={onClose}
      leftButtonText="Otkaži"
      rightButtonText="Sačuvaj"
      rightButtonOnClick={handleSubmit(onSubmit)}
      buttonLoading={isSaving}
      content={
        <ModalContentWrapper>
          <FormGroup>
            <Input
              {...register('certificate_issuer', {required: 'Ovo polje je obavezno'})}
              label="INSTITUCIJA:"
              error={errors.certificate_issuer?.message as string}
              isRequired
            />
          </FormGroup>

          <FormGroup>
            <Controller
              name="type"
              rules={{required: 'Ovo polje je obavezno'}}
              control={control}
              render={({field: {onChange, name, value}}) => {
                return (
                  <Dropdown
                    onChange={onChange}
                    value={value}
                    name={name}
                    label="STEPEN ŠKOLSKOG OBRAZOVANJA:"
                    options={settingsData}
                    error={errors.type?.message as string}
                    isRequired
                  />
                );
              }}
            />
          </FormGroup>

          <FormGroup>
            <Controller
              name="academic_title"
              rules={{required: 'Ovo polje je obavezno'}}
              control={control}
              render={({field: {onChange, name, value}}) => (
                <Dropdown
                  onChange={onChange}
                  value={value}
                  name={name}
                  label="STEPEN STRUČNE OSPOSOBLJENOSTI:"
                  options={academicTitles}
                  error={errors.academic_title?.message as string}
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
                onUpload={(item: any) => console.log(item)}
                note={<Typography variant="bodySmall" content="Obrazovni sertifikat" />}
                buttonText="Učitaj"
              />
            </FileUploadWrapper>
          </FormGroup>
        </ModalContentWrapper>
      }
      title={'DODAJTE NOVO AKADEMSKO OBRAZOVANJE'}
    />
  );
};
