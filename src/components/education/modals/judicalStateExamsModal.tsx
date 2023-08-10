import {CheckIcon, Datepicker, Dropdown, FileUpload, Modal, Theme, Typography} from 'client-library';
import React, {useEffect, useMemo} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {ModalProps} from '../../../screens/employees/education/types';
import {UserProfileEducationItem} from '../../../types/graphql/userProfileGetEducation';
import {parseDate} from '../../../utils/dateUtils';
import {examTypes} from './constants';
import {FileUploadWrapper, FormGroup, ModalContentWrapper} from './styles';
import useEducationInsert from '../../../services/graphql/userProfile/education/useEducationInsert';

const initialValues: UserProfileEducationItem = {
  id: 0,
  user_profile_id: 1,
  education_type_id: 3,
  date_of_certification: '',
  price: 0,
  date_of_start: '',
  date_of_end: '',
  academic_title: '',
  expertise_level: '',
  certificate_issuer: '',
  description: '',
  created_at: '',
  updated_at: '',
  file_id: '1',
};

interface JudicalAndStateExamsModal extends ModalProps {
  alert: any;
  refetch: () => void;
}

export const JudicalAndStateExamsModal: React.FC<JudicalAndStateExamsModal> = ({
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
          academic_title: {
            id: selectedItem?.academic_title,
            title: selectedItem?.academic_title,
          },
        }
      : initialValues;
  }, [selectedItem]);

  const {
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
      date_of_certification: parseDate(values?.date_of_certification, true),
      academic_title: values?.academic_title?.id,
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
          <FormGroup>
            <Controller
              name="academic_title"
              rules={{required: 'Ovo polje je obavezno'}}
              control={control}
              render={({field: {onChange, name, value}}) => (
                <Dropdown
                  onChange={onChange}
                  value={value as any}
                  name={name}
                  label="VRSTA ISPITA"
                  options={examTypes}
                  rightOptionIcon={<CheckIcon stroke={Theme.palette.primary500} />}
                  error={errors.academic_title?.message as string}
                />
              )}
            />
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
                  value={value ? parseDate(value) : ''}
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
