import {yupResolver} from '@hookform/resolvers/yup';
import {Datepicker, Dropdown, FileUpload, Input, Modal, Typography} from 'client-library';
import React, {useEffect} from 'react';
import {Controller, useForm} from 'react-hook-form';
import * as yup from 'yup';
import {yesOrNoOptionsString} from '../../constants';
import {ExperienceModalProps} from '../../screens/employees/experience/types';
import {formatData} from '../../screens/employees/experience/utils';
import useOrganizationUnits from '../../services/graphql/organizationUnits/useOrganizationUnits';
import useExperienceInsert from '../../services/graphql/userProfile/experience/useExperienceInsert';
import {DropdownDataString} from '../../types/dropdownData';
import {calculateExperience, parseToDate} from '../../utils/dateUtils';
import {FileUploadWrapper, FormWrapper, Row} from './styles';

const experienceSchema = yup.object().shape({
  relevant: yup
    .object()
    .default(undefined)
    .required('Ovo polje je obavezno')
    .shape({id: yup.string().required(), title: yup.string().required()}),
  amount_of_experience: yup.number().required('Ovo polje je obavezno'),
  amount_of_insured_experience: yup
    .number()
    .transform(value => (!value || isNaN(value) ? null : value))
    .nullable()
    .required('Ovo polje je obavezno'),
  date_of_end: yup
    .date()
    .required('Ovo polje je obavezno')
    .min(yup.ref('date_of_start'), 'Kraj radnog odnosa ne može biti prije početka radnog odnosa.')
    .nullable(),
  date_of_start: yup.date().required('Ovo polje je obavezno').nullable(),
  organization_unit: yup.string().when('relevant', {
    is: (value: DropdownDataString) => value && value.id === 'Ne',
    then: schema => schema.required('Ovo polje je obavezno'),
    otherwise: schema => schema.optional(),
  }),
  organization_unit_id: yup
    .object()
    .default(undefined)
    .shape({id: yup.string().required(), title: yup.string().required()})
    .when('relevant', {
      is: (value: DropdownDataString) => value && value.id === 'Da',
      then: schema => schema.required('Ovo polje je obavezno'),
      otherwise: schema => schema.optional(),
    }),
  user_profile_id: yup.number().required(),
});

export const ExperienceModal: React.FC<ExperienceModalProps> = ({
  refetchList,
  selectedItem,
  open,
  onClose,
  units,
  userProfileId,
  alert,
}) => {
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: {errors},
    reset,
    setValue,
  } = useForm({resolver: yupResolver(experienceSchema), defaultValues: {user_profile_id: userProfileId}});

  const {mutate, loading: isSaving} = useExperienceInsert();
  const {organizationUnitsList} = useOrganizationUnits();

  const {relevant, date_of_start, date_of_end} = watch();

  useEffect(() => {
    if (selectedItem) {
      reset({
        ...selectedItem,
        relevant: {id: selectedItem?.relevant ? 'Da' : 'Ne', title: selectedItem?.relevant ? 'Da' : 'Ne'},
        organization_unit_id: organizationUnitsList
          .slice(1)
          .find(orgUnit => orgUnit.id === selectedItem?.organization_unit_id),
        date_of_start: parseToDate(selectedItem?.date_of_start),
        date_of_end: parseToDate(selectedItem?.date_of_end),
        user_profile_id: userProfileId,
      });
    }
  }, [selectedItem]);

  const onSubmit = (data: any) => {
    if (isSaving) return;

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
      reset();
    }
  };

  useEffect(() => {
    if (date_of_end && date_of_start) {
      const calculatedExperience = calculateExperience(date_of_start, date_of_end);
      setValue('amount_of_experience', calculatedExperience);
    }
  }, [date_of_end, date_of_start]);

  return (
    <Modal
      open={open}
      onClose={() => {
        onClose();
        reset();
      }}
      leftButtonText="Otkaži"
      rightButtonText="Sačuvaj"
      rightButtonOnClick={handleSubmit(onSubmit)}
      buttonLoading={isSaving}
      content={
        <FormWrapper>
          <Row>
            <Controller
              name="relevant"
              control={control}
              render={({field: {onChange, name, value}}) => {
                return (
                  <Dropdown
                    onChange={onChange}
                    value={value as any}
                    name={name}
                    label="SUDSTVO:"
                    options={yesOrNoOptionsString}
                    error={errors.relevant?.message}
                  />
                );
              }}
            />
            <Controller
              name="date_of_start"
              control={control}
              render={({field: {onChange, name, value}}) => (
                <Datepicker
                  onChange={onChange}
                  label="POČETAK RADNOG ODNOSA:"
                  name={name}
                  selected={value}
                  error={errors.date_of_start?.message}
                />
              )}
            />
          </Row>
          <Row>
            <Controller
              name="organization_unit_id"
              control={control}
              render={({field: {onChange, name, value}}) => {
                return (
                  <Dropdown
                    onChange={onChange}
                    value={value as any}
                    name={name}
                    label="JEDINICA:"
                    options={units}
                    isDisabled={relevant?.id === 'Ne' || !relevant}
                    error={errors.organization_unit_id?.message}
                  />
                );
              }}
            />
            <Controller
              name="date_of_end"
              control={control}
              render={({field: {onChange, name, value}}) => (
                <Datepicker
                  onChange={onChange}
                  label="KRAJ RADNOG ODNOSA:"
                  name={name}
                  selected={value}
                  error={errors.date_of_end?.message}
                />
              )}
            />
          </Row>
          <Row>
            <Input
              {...register('organization_unit')}
              label="ORGANIZACIJA/INSTITUCIJA:"
              error={errors.organization_unit?.message}
              disabled={relevant?.id === 'Da' || !relevant}
            />
            <Input {...register('amount_of_insured_experience')} label="PRIJAVLJENI STAŽ (MJESECI):" type="number" />
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
