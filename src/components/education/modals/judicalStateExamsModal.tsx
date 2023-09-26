import {Datepicker, Dropdown, FileUpload, Modal, Typography, Input} from 'client-library';
import React, {useEffect, useMemo} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {ModalProps} from '../../../screens/employees/education/types';
import useSettingsDropdownOverview from '../../../services/graphql/settingsDropdown/useSettingsDropdownOverview';
import useEducationInsert from '../../../services/graphql/userProfile/education/useEducationInsert';
import {UserProfileEducationFormValues} from '../../../types/graphql/userProfileGetEducation';
import {educationTypes, initialValues} from './constants';
import {FileUploadWrapper, FormGroup, ModalContentWrapper} from './styles';
import {parseDateForBackend, parseToDate} from '../../../utils/dateUtils';

export const JudicalAndStateExamsModal: React.FC<ModalProps> = ({
  selectedItem,
  open,
  onClose,
  alert,
  refetchList,
  navigation,
}) => {
  const {data: types} = useSettingsDropdownOverview({entity: educationTypes.education_exam_types});
  const typesOptions = useMemo(() => types?.map(type => ({id: type.id as number, title: type.title})) || [], [types]);

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
  } = useForm({defaultValues: initialValues});

  const {mutate, loading: isSaving} = useEducationInsert();

  useEffect(() => {
    item && reset({...item, date_of_certification: parseToDate(item.date_of_certification)});
  }, [item]);

  const onSubmit = async (values: UserProfileEducationFormValues) => {
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

    try {
      mutate(
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
    } finally {
      reset(initialValues);
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
                  value={value as any}
                  name={name}
                  label="VRSTA ISPITA"
                  options={typesOptions}
                  error={errors.type?.message as string}
                />
              )}
            />
          </FormGroup>
          <FormGroup>
            <Input {...register('score')} label="BROJ BODOVA:" type="number" />
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
                onUpload={item => console.log(item)}
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
