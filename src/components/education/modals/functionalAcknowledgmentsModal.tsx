import {CheckIcon, Datepicker, Dropdown, FileUpload, Input, Modal, Theme, Typography} from 'client-library';
import React, {useEffect, useMemo} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {ModalProps} from '../../../screens/employees/education/types';
import {UserProfileEducationFormValues, UserProfileEducationItem} from '../../../types/graphql/userProfileGetEducation';
import {parseDate} from '../../../utils/dateUtils';
import {functionalAcknowledgmentGrades} from './constants';
import {FileUploadWrapper, ModalContentWrapper, Row} from './styles';
import useEducationInsert from '../../../services/graphql/userProfile/education/useEducationInsert';

const initialValues: UserProfileEducationFormValues = {
  id: 0,
  title: '',
  user_profile_id: 1,
  education_type_id: 4,
  date_of_certification: '',
  price: 0,
  date_of_start: '',
  date_of_end: '',
  academic_title: '',
  expertise_level: '',
  certificate_issuer: '',
  description: '',
  file_id: null,
};

interface FunctionalAcknowledgmentModal extends ModalProps {
  alert: any;
  refetch: () => void;
}

export const FunctionalAcknowledgmentModal: React.FC<FunctionalAcknowledgmentModal> = ({
  selectedItem,
  open,
  onClose,
  alert,
  refetch,
}) => {
  const item = useMemo(() => {
    return selectedItem
      ? {
        ...selectedItem,
        expertise_level: {
          id: selectedItem?.expertise_level,
          title: selectedItem?.expertise_level,
        },
      }
      : initialValues;
  }, [selectedItem]);

  const {
    register,
    handleSubmit,
    control,
    formState: {errors},
    reset,
  } = useForm({defaultValues: item || initialValues});

  const {mutate} = useEducationInsert();

  useEffect(() => {
    if (item) {
      reset(item);
    }
  }, [item]);

  const onSubmit = async (values: any) => {
    const data = {
      ...values,
      date_of_start: parseDate(values?.date_of_start, true),
      date_of_end: parseDate(values?.date_of_end, true),
      academic_title: values?.academic_title,
      expertise_level: values?.expertise_level?.title,
      price: values?.price.toString(),
    };

    if (!selectedItem) {
      delete data.id;
    }

    try {
      mutate(
        data,
        () => {
          alert.success('Uspješno sačuvano');
          refetch();
          onClose();
        },
        () => {
          alert.error('Nije uspješno sačuvano');
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
              {...register('academic_title', {required: 'Ovo polje je obavezno'})}
              label="FUNKCIONALNA ZNANJA:"
              error={errors.academic_title?.message as string}
            />
            <Input
              {...register('certificate_issuer', {required: 'Ovo polje je obavezno'})}
              label="IZVOĐAČ:"
              error={errors.certificate_issuer?.message as string}
            />
          </Row>
          <Row>
            <Controller
              name="expertise_level"
              rules={{required: 'Ovo polje je obavezno'}}
              control={control}
              render={({field: {onChange, name, value}}) => (
                <Dropdown
                  onChange={onChange}
                  value={value as any}
                  name={name}
                  label="OCJENA:"
                  options={functionalAcknowledgmentGrades}
                  rightOptionIcon={<CheckIcon stroke={Theme.palette.primary500} />}
                  error={errors.expertise_level?.message as string}
                />
              )}
            />
            <Input
              {...register('price', {required: 'Ovo polje je obavezno'})}
              label="KOTIZACIJA:"
              name="price"
              leftContent={<Typography content={<div>&euro;</div>} />}
              style={{maxWidth: '300px'}}
              error={errors.price?.message as string}
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
                  value={value ? parseDate(value) : ''}
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
                  value={value ? parseDate(value) : ''}
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
