import {Typography, Modal, Input, Datepicker, FileUpload, Dropdown} from 'client-library';
import {FileUploadWrapper, FormWrapper, Row} from './styles';
import {ExperienceModalProps} from '../../screens/employees/experience/types';
import React, {useEffect, useMemo} from 'react';
import {parseDate} from '../../utils/dateUtils';
import {formatData} from '../../screens/employees/experience/utils';
import {UserProfileExperience} from '../../types/graphql/userProfileGetExperienceTypes';
import {Controller, useForm} from 'react-hook-form';
import {yesOrNoOptionsString} from '../../constants';
import useExperienceInsert from '../../services/graphql/userProfile/experience/useExperienceInsert';

const initialValues: UserProfileExperience = {
  id: 0,
  user_profile_id: 0,
  relevant: false,
  amount_of_experience: 0,
  amount_of_insured_experience: 0,
  date_of_end: '',
  date_of_signature: '',
  date_of_start: '',
  organization_unit: '',
  organization_unit_id: 0,
  reference_file_id: 0,
  updated_at: '',
  created_at: '',
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
          selectedOrganizationUnit: {
            id: selectedItem?.relevant ? selectedItem?.organization_unit_id : 0,
            title: selectedItem?.relevant ? selectedItem?.organization_unit : '',
          },
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
  } = useForm({defaultValues: item || initialValues});

  const {mutate} = useExperienceInsert(
    () => {
      console.log('refetching');
      refetchList();
      alert.success('Uspješno sačuvano');
      onClose();
    },
    () => {
      alert.error('Greška pri čuvanju podataka');
    },
  );

  const relevant = watch('relevant');

  useEffect(() => {
    if (item) {
      reset(item);
    }
  }, [item]);

  const onSubmit = (data: any) => {
    const payload = formatData(data);
    mutate(payload);
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
                  value={value ? parseDate(value) : ''}
                  error={errors.date_of_start?.message as string}
                />
              )}
            />
          </Row>
          <Row>
            <Controller
              name="selectedOrganizationUnit"
              rules={{
                required: {value: relevant === true || relevant?.title === 'Da', message: 'Ovo polje je obavezno'},
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
                    isDisabled={relevant === false || relevant?.title === 'Ne'}
                    error={errors.selectedOrganizationUnit?.message as string}
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
                  !value || !watch('date_of_start') || new Date(value) >= new Date(watch('date_of_start'))
                    ? true
                    : 'Kraj radnog odnosa ne može biti prije početka radnog odnosa.',
              }}
              render={({field: {onChange, name, value}}) => (
                <Datepicker
                  onChange={onChange}
                  label="KRAJ RADNOG ODNOSA:"
                  name={name}
                  value={value ? parseDate(value) : ''}
                  error={errors.date_of_end?.message as string}
                />
              )}
            />
          </Row>
          <Row>
            <Input
              {...register('organization_unit', {
                required: {value: relevant === false || relevant?.title === 'Ne', message: 'Ovo polje je obavezno'},
              })}
              label="ORGANIZACIJA/INSTITUCIJA:"
              error={errors.organization_unit?.message as string}
              disabled={relevant === true || relevant?.title === 'Da'}
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
