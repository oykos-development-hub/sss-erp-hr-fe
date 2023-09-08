import {Datepicker, Dropdown, FileUpload, Input, Modal, Typography} from 'client-library';
import React, {useEffect, useMemo} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {ModalProps} from '../../../screens/employees/education/types';
import useSettingsDropdownOverview from '../../../services/graphql/settingsDropdown/useSettingsDropdownOverview';
import useEducationInsert from '../../../services/graphql/userProfile/education/useEducationInsert';
import {UserProfileEducationFormValues} from '../../../types/graphql/userProfileGetEducation';
import {educationTypes, initialValues} from './constants';
import {FileUploadWrapper, ModalContentWrapper, Row} from './styles';
import {parseDateForBackend, parseToDate} from '../../../utils/dateUtils';

export const FunctionalAcknowledgmentModal: React.FC<ModalProps> = ({
  selectedItem,
  open,
  onClose,
  alert,
  refetchList,
  navigation,
}) => {
  const {data: types} = useSettingsDropdownOverview({entity: educationTypes.education_functional_types});
  const typesOptions = useMemo(() => types?.map(type => ({id: type.id as number, title: type.title})) || [], [types]);

  const item = useMemo(() => selectedItem || initialValues, [selectedItem]);

  const {
    register,
    handleSubmit,
    control,
    formState: {errors},
    reset,
  } = useForm({defaultValues: item});

  const {mutate} = useEducationInsert();

  useEffect(() => {
    item &&
      reset({...item, date_of_start: parseToDate(item.date_of_start), date_of_end: parseToDate(item.date_of_end)});
  }, [item]);

  const onSubmit = async (values: UserProfileEducationFormValues) => {
    const data = {
      id: values.id,
      title: values.title,
      date_of_certification: '',
      price: Number(values.price),
      date_of_start: parseDateForBackend(values?.date_of_start),
      date_of_end: parseDateForBackend(values?.date_of_end),
      expertise_level: values?.expertise_level,
      certificate_issuer: values.certificate_issuer,
      description: values.description,
      file_id: values.file_id,
      academic_title: values.academic_title?.id || '',
      type_id: values.type?.id || 0,
      user_profile_id: Number(navigation.location.pathname.split('/')[4]),
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
      content={
        <ModalContentWrapper>
          <Row>
            <Input
              {...register('expertise_level', {required: 'Ovo polje je obavezno'})}
              label="FUNKCIONALNA ZNANJA:"
              error={errors.expertise_level?.message as string}
            />
            <Input
              {...register('certificate_issuer', {required: 'Ovo polje je obavezno'})}
              label="IZVOĐAČ:"
              error={errors.certificate_issuer?.message as string}
            />
          </Row>
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
                  label="OCJENA:"
                  options={typesOptions}
                  error={errors.type?.message as string}
                />
              )}
            />
            <Input
              {...register('price', {required: 'Ovo polje je obavezno'})}
              label="KOTIZACIJA:"
              leftContent={<Typography content={<div>&euro;</div>} />}
              style={{maxWidth: '300px'}}
              error={errors.price?.message as string}
              type="number"
            />
          </Row>
          <Row>
            <Controller
              name="date_of_start"
              control={control}
              rules={{required: 'Ovo polje je obavezno'}}
              render={({field: {onChange, name, value}}) => (
                <Datepicker
                  onChange={onChange}
                  label="POČETAK:"
                  name={name}
                  selected={value}
                  error={errors.date_of_start?.message as string}
                />
              )}
            />
            <Controller
              name="date_of_end"
              control={control}
              rules={{required: 'Ovo polje je obavezno'}}
              render={({field: {onChange, name, value}}) => (
                <Datepicker
                  onChange={onChange}
                  label="KRAJ:"
                  name={name}
                  selected={value}
                  error={errors.date_of_end?.message as string}
                />
              )}
            />
          </Row>
          <FileUploadWrapper>
            <FileUpload
              icon={<></>}
              style={{width: '100%'}}
              variant="secondary"
              onUpload={item => console.log(item)}
              note={<Typography variant="bodySmall" content="Funkcionalni sertifikat" />}
              buttonText="Učitaj"
            />
          </FileUploadWrapper>
        </ModalContentWrapper>
      }
      title={'DODAJTE NOVA FUNKCIONALNA ZNANJA'}
    />
  );
};
