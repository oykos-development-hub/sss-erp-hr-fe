import {CheckIcon, Datepicker, Dropdown, FileUpload, Modal, Theme, Typography} from 'client-library';
import React, {useEffect, useMemo} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {ModalProps} from '../../../screens/employees/education/types';
import {parseDate} from '../../../utils/dateUtils';
import {educationTypes, examTypes, initialValues} from './constants';
import {FileUploadWrapper, FormGroup, ModalContentWrapper} from './styles';
import useEducationInsert from '../../../services/graphql/userProfile/education/useEducationInsert';
import useSettingsDropdownOverview from '../../../services/graphql/settingsDropdown/useSettingsDropdownOverview';

export const JudicalAndStateExamsModal: React.FC<ModalProps> = ({
  selectedItem,
  open,
  onClose,
  alert,
  refetchList,
  navigation,
}) => {
  const {data: types} = useSettingsDropdownOverview(educationTypes.education_exam_types);

  const typesOptions = useMemo(() => {
    return types?.map(type => ({id: type.id as number, title: type.title})) || [];
  }, [types]);

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
  } = useForm({defaultValues: item});

  const {mutate} = useEducationInsert();

  useEffect(() => {
    if (item) {
      reset(item);
    }
  }, [item]);

  const onSubmit = async (values: any) => {
    const data = {
      id: values.id,
      title: values.title,
      date_of_certification: values.date_of_certification,
      price: values.price,
      date_of_start: parseDate(values?.date_of_start, true),
      date_of_end: parseDate(values?.date_of_end, true),
      expertise_level: values.expertise_level,
      certificate_issuer: values.certificate_issuer,
      description: values.description,
      file_id: values.file_id,
      academic_title: values.academic_title?.id || '',
      type_id: values.type?.id || 0,
      user_profile_id: Number(navigation.location.pathname.split('/')[3]),
    };

    try {
      mutate(
        data,
        () => {
          alert.success('Uspješno sačuvano');
          refetchList && refetchList();
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
