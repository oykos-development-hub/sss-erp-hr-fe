import {CheckIcon, Dropdown, FileUpload, Input, Modal, Theme, Typography} from 'client-library';
import React, {useEffect, useMemo} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {ModalProps} from '../../../screens/employees/education/types';
import {UserProfileEducationFormValues, UserProfileEducationItem} from '../../../types/graphql/userProfileGetEducation';
import {academicTitles, educationTypes} from './constants';
import {FileUploadWrapper, FormGroup, ModalContentWrapper} from './styles';
import useEducationInsert from '../../../services/graphql/userProfile/education/useEducationInsert';

const initialValues: UserProfileEducationFormValues = {
  id: 0,
  title: '',
  user_profile_id: 1,
  education_type_id: 1,
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

interface AcademicEducationModalProps extends ModalProps {
  alert: any;
  refetch: () => void;
}

export const AcademicEducationModal: React.FC<AcademicEducationModalProps> = ({
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
        academic_title: {
          id: selectedItem?.academic_title,
          title: selectedItem?.academic_title,
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
    const data = {...values, academic_title: values.academic_title?.id, expertise_level: values.expertise_level?.id};

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
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      leftButtonText="Otkaži"
      rightButtonText="Sačuvaj"
      rightButtonOnClick={handleSubmit(onSubmit)}
      content={
        <ModalContentWrapper>
          <FormGroup>
            <Input
              {...register('certificate_issuer', {required: 'Ovo polje je obavezno'})}
              label="IZDAVAČ SERTIFIKATA:"
              error={errors.certificate_issuer?.message as string}
            />
          </FormGroup>

          <FormGroup>
            <Controller
              name="expertise_level"
              rules={{required: 'Ovo polje je obavezno'}}
              control={control}
              render={({field: {onChange, name, value}}) => (
                <Dropdown
                  onChange={onChange}
                  value={value as any}
                  name={name}
                  label="STEPEN ŠKOLSKOG OBRAZOVANJA:"
                  options={educationTypes}
                  rightOptionIcon={<CheckIcon stroke={Theme.palette.primary500} />}
                  error={errors.expertise_level?.message as string}
                />
              )}
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
                  value={value as any}
                  name={name}
                  label="STEPEN STRUČNE OSPOSOBLJENOSTI:"
                  options={academicTitles}
                  rightOptionIcon={<CheckIcon stroke={Theme.palette.primary500} />}
                  error={errors.academic_title?.message as string}
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
      title={'DODAJTE NOVO AKADEMSKO OBRAZOVANJE'}
    />
  );
};
