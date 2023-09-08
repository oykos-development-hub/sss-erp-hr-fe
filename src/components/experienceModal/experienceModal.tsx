import {Datepicker, Dropdown, FileUpload, Input, Modal, Typography} from 'client-library';
import React, {useEffect, useMemo} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {yesOrNoOptionsString} from '../../constants';
import {ExperienceModalProps} from '../../screens/employees/experience/types';
import {formatData} from '../../screens/employees/experience/utils';
import useExperienceInsert from '../../services/graphql/userProfile/experience/useExperienceInsert';
import {UserProfileExperienceFormValues} from '../../types/graphql/userProfileGetExperienceTypes';
import {FileUploadWrapper, FormWrapper, Row} from './styles';
import {parseToDate} from '../../utils/dateUtils';

const initialValues: UserProfileExperienceFormValues = {
  id: null,
  user_profile_id: 0,
  relevant: null,
  amount_of_experience: 0,
  amount_of_insured_experience: 0,
  date_of_end: null,
  date_of_signature: null,
  date_of_start: null,
  organization_unit: '',
  organization_unit_id: 0,
  reference_file_id: 0,
};

export const ExperienceModal: React.FC<ExperienceModalProps> = ({
  refetchList,
  selectedItem,
  open,
  onClose,
  units,
  userProfileId,
  alert,
}) => {
  const item = useMemo(() => {
    return selectedItem
      ? {
          ...selectedItem,
          relevant: {id: selectedItem?.relevant ? 'Da' : 'Ne', title: selectedItem?.relevant ? 'Da' : 'Ne'},
          organization_unit_id: {
            id: selectedItem?.relevant ? selectedItem?.organization_unit_id : 0,
            title: selectedItem?.relevant ? selectedItem?.organization_unit : '',
          },
          date_of_start: parseToDate(selectedItem?.date_of_start),
          date_of_end: parseToDate(selectedItem?.date_of_end),
        }
      : {...initialValues, user_profile_id: Number(userProfileId)};
  }, [selectedItem]);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: {errors},
    reset,
  } = useForm({defaultValues: initialValues});

  const {mutate} = useExperienceInsert();

  const relevant = watch('relevant');
  const dateOfStart = watch('date_of_start');

  useEffect(() => {
    if (item) {
      reset(item);
    }
  }, [item]);

  const onSubmit = (data: UserProfileExperienceFormValues) => {
    const payload = formatData(data, !selectedItem);

    try {
      mutate(
        payload,
        () => {
          alert.success('Uspješno sačuvano.');
          refetchList();
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
      }}
      leftButtonText="Otkaži"
      rightButtonText="Sačuvaj"
      rightButtonOnClick={handleSubmit(onSubmit)}
      content={
        <FormWrapper>
          <Row>
            <Controller
              name="relevant"
              rules={{required: 'Ovo polje je obavezno'}}
              control={control}
              render={({field: {onChange, name, value}}) => {
                return (
                  <Dropdown
                    onChange={onChange}
                    value={value as any}
                    name={name}
                    label="SUDSTVO:"
                    options={yesOrNoOptionsString}
                    error={errors.relevant?.message as string}
                  />
                );
              }}
            />
            <Controller
              name="date_of_start"
              control={control}
              rules={{required: 'Ovo polje je obavezno'}}
              render={({field: {onChange, name, value}}) => (
                <Datepicker
                  onChange={onChange}
                  label="POČETAK RADNOG ODNOSA:"
                  name={name}
                  selected={value}
                  error={errors.date_of_start?.message as string}
                />
              )}
            />
          </Row>
          <Row>
            <Controller
              name="organization_unit_id"
              rules={{
                required: {value: relevant?.title === 'Da', message: 'Ovo polje je obavezno'},
              }}
              control={control}
              render={({field: {onChange, name, value}}) => {
                return (
                  <Dropdown
                    onChange={onChange}
                    value={value as any}
                    name={name}
                    label="JEDINICA:"
                    options={units}
                    isDisabled={relevant?.title === 'Ne'}
                    error={errors.organization_unit_id?.message as string}
                  />
                );
              }}
            />
            <Controller
              name="date_of_end"
              control={control}
              rules={{
                required: 'Ovo polje je obavezno',
                validate: value =>
                  !value || !watch('date_of_start') || (dateOfStart && new Date(value) >= dateOfStart)
                    ? true
                    : 'Kraj radnog odnosa ne može biti prije početka radnog odnosa.',
              }}
              render={({field: {onChange, name, value}}) => (
                <Datepicker
                  onChange={onChange}
                  label="KRAJ RADNOG ODNOSA:"
                  name={name}
                  selected={value}
                  error={errors.date_of_end?.message as string}
                />
              )}
            />
          </Row>
          <Row>
            <Input
              {...register('organization_unit', {
                required: {value: relevant?.title === 'Ne', message: 'Ovo polje je obavezno'},
              })}
              label="ORGANIZACIJA/INSTITUCIJA:"
              error={errors.organization_unit?.message as string}
              disabled={relevant?.title === 'Da'}
            />
            <Input
              {...register('amount_of_insured_experience', {required: 'Ovo polje je obavezno'})}
              label="PRIJAVLJENI STAŽ (MJESECI):"
              error={errors.amount_of_insured_experience?.message as string}
            />
          </Row>

          <FileUploadWrapper>
            <FileUpload
              icon={<></>}
              style={{width: '100%'}}
              variant="secondary"
              onUpload={item => console.log(item)}
              note={<Typography variant="bodySmall" content="Dokaz o zaposlenju" />}
              buttonText="Učitaj"
            />
          </FileUploadWrapper>
        </FormWrapper>
      }
      title={'DODAJTE NOVO ZAPOSLENJE'}
    />
  );
};
