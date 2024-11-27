import {yupResolver} from '@hookform/resolvers/yup';
import {Checkbox, Datepicker, Dropdown, Input} from 'client-library';
import React, {useEffect, useState, useMemo} from 'react';
import {Controller, useForm} from 'react-hook-form';
import * as yup from 'yup';
import {cityData} from '../../constants';
import useInsertForeignerPermits from '../../services/graphql/foreignerPermits/useInsertForeignerPermit';
import {ForeignerPermit} from '../../types/graphql/foreignerPermits';
import {parseDateForBackend, parseToDate} from '../../utils/dateUtils';
import {CheckboxContainer, CheckboxLabel, ColumnTitle, Form, FormColumn, FormGroup, PermitModal} from './styles';
import {dropdownStringSchema} from '../../screens/employees/basicInfo/constants';

const permitSchema = yup.object().shape({
  work_permit_number: yup.string().required('Ovo polje je obavezno'),
  work_permit_issuer: yup.object().default(undefined).shape(dropdownStringSchema).required('Ovo polje je obavezno'),
  work_permit_date_of_start: yup.date().required('Ovo polje je obavezno'),
  work_permit_date_of_end: yup
    .date()
    .nullable()
    .min(yup.ref('work_permit_date_of_start'), 'Datum isteka ne može biti prije datuma izdavanja')
    .when('residence_permit_indefinite_length', {
      is: (value: any) => !value,
      then: schema => schema.required('Ovo polje je obavezno'),
    }),
  residence_permit_date_of_end: yup.date().optional(),
  residence_permit_number: yup.string().required('Ovo polje je obavezno'),
  country_of_origin: yup.object().default(undefined).shape(dropdownStringSchema).required('Ovo polje je obavezno'),
  user_profile_id: yup.number().required('Ovo polje je obavezno'),
  residence_permit_indefinite_length: yup.boolean().required('Ovo polje je obavezno'),
});

interface PermitEntryModalProps {
  open: boolean;
  onClose: () => void;
  permitData?: ForeignerPermit;
  id: number;
  refetchList: () => void;
  countries: any[];
  alert: any;
}

const PermitEntryModal: React.FC<PermitEntryModalProps> = ({
  onClose,
  open,
  permitData,
  id,
  refetchList,
  countries,
  alert,
}) => {
  const countryOptions = useMemo(() => {
    return countries?.map((country: any) => {
      return {
        id: country.name,
        title: country.name,
      };
    });
  }, [countries]);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: {errors},
    reset,
    setValue,
    getValues
  } = useForm({
    defaultValues: {user_profile_id: id ?? 0, residence_permit_indefinite_length: false},
    resolver: yupResolver(permitSchema),
  });

  const indefinite = watch('residence_permit_indefinite_length');
  const [previousEndDate, setPreviousEndDate] = useState<Date | undefined>(undefined);

  useEffect(() => {
    if (indefinite) {
      const previous = getValues('work_permit_date_of_end');
      if (previous) {
        setPreviousEndDate(previous);
      }
      
      setValue('work_permit_date_of_end', undefined);
    } else if (previousEndDate) {
      setValue('work_permit_date_of_end', previousEndDate);
    }
  }, [indefinite]);  

  const {mutate, loading: isSaving} = useInsertForeignerPermits();

  useEffect(() => {
    if (permitData) {
      reset({
        ...permitData,
        country_of_origin: countryOptions.find((country: any) => country.id === permitData.country_of_origin),
        work_permit_issuer: cityData.find((city: any) => city.id === permitData.work_permit_issuer),
        work_permit_date_of_start: parseToDate(permitData.work_permit_date_of_start) ?? undefined,
        work_permit_date_of_end: parseToDate(permitData.work_permit_date_of_end),
        residence_permit_date_of_end: parseToDate(permitData.residence_permit_date_of_end) ?? undefined,
      });
    }
  }, [permitData]);

  const onSubmit = async (values: any) => {

    if (isSaving) return;

    const data = {
      ...values,
      work_permit_issuer: values.work_permit_issuer.id,
      country_of_origin: values.country_of_origin.id,
      user_profile_id: id,
      work_permit_date_of_start: parseDateForBackend(values.work_permit_date_of_start),
      work_permit_date_of_end: values.residence_permit_indefinite_length
        ? null
        : parseDateForBackend(values.work_permit_date_of_end),
      residence_permit_date_of_end: parseDateForBackend(values.residence_permit_date_of_end),
      residence_permit_file_id: values.residence_permit_file_id || 0,
      work_permit_file_id: values.work_permit_file_id || 0,
    };

    try {
      mutate(data, () => {
        refetchList();
        alert.success('Uspješno sačuvano.');
        onClose();
        reset();
        setPreviousEndDate(undefined);
      });
    } catch (e) {
      alert.error('Greška. Promjene nisu sačuvane.');
      console.log(e);
    }
  };

  return (
    <PermitModal
      onClose={() => {
        reset();
        onClose();
      }}
      open={open}
      title="DODAJTE DOZVOLU"
      style={{width: '1020px'}}
      rightButtonOnClick={handleSubmit(onSubmit)}
      rightButtonText="Sačuvaj"
      leftButtonText="Otkaži"
      buttonLoading={isSaving}
      content={
        <Form>
          <FormColumn>
            <ColumnTitle content="PODACI O RADNOJ DOZVOLI" variant="bodySmall" style={{fontWeight: 600}} />
            <FormGroup>
              <Input
                {...register('work_permit_number')}
                label="BROJ:"
                error={errors.work_permit_number?.message}
                isRequired
                placeholder="Unesite broj radne dozvole"
              />
            </FormGroup>
            <FormGroup>
              <Controller
                name="work_permit_issuer"
                control={control}
                render={({field: {onChange, name, value}}) => (
                  <Dropdown
                    onChange={onChange}
                    value={value}
                    name={name}
                    label="IZDAVALAC:"
                    options={cityData}
                    isRequired
                    error={errors.work_permit_issuer?.message}
                    placeholder="Izaberite izdavaoca"
                  />
                )}
              />
            </FormGroup>
            <FormGroup>
              <Controller
                name="work_permit_date_of_start"
                control={control}
                render={({field: {onChange, name, value}}) => (
                  <Datepicker
                    onChange={onChange}
                    label="VAŽI OD:"
                    name={name}
                    selected={value}
                    isRequired
                    error={errors.work_permit_date_of_start?.message}
                  />
                )}
              />
            </FormGroup>
            <FormGroup>
              <Controller
                name="work_permit_date_of_end"
                control={control}
                render={({field: {onChange, name, value}}) => {
                  return (
                    <Datepicker
                      onChange={onChange}
                      label="VAŽI DO:"
                      name={name}
                      selected={value}
                      isRequired
                      error={errors.work_permit_date_of_end?.message}
                      disabled={indefinite}
                    />
                  );
                }}
              />
            </FormGroup>

            <Controller
              name="residence_permit_indefinite_length"
              control={control}
              render={({field: {name, value, onChange}}) => {
                return (
                  <CheckboxContainer>
                    <Checkbox onChange={onChange} name={name} checked={value} />
                    <CheckboxLabel content="Neograničeno trajanje" variant="bodySmall" />
                  </CheckboxContainer>
                );
              }}
            />
          </FormColumn>
          <FormColumn>
            <ColumnTitle content="PODACI O BORAVIŠNOJ VIZI" variant="bodySmall" style={{fontWeight: 600}} />
            <FormGroup>
              <Input
                {...register('residence_permit_number')}
                label="BROJ PASOŠA:"
                isRequired
                error={errors.residence_permit_number?.message}
                placeholder="Unesite broj pasoša"
              />
            </FormGroup>
            <FormGroup>
              <Controller
                name="residence_permit_date_of_end"
                control={control}
                render={({field: {onChange, name, value}}) => (
                  <Datepicker
                    onChange={onChange}
                    label="VAŽI DO:"
                    name={name}
                    selected={value}
                    isRequired
                    error={errors.residence_permit_date_of_end?.message}
                  />
                )}
              />
            </FormGroup>
          </FormColumn>
          <FormColumn>
            <ColumnTitle content="REZIDENTSTVO" variant="bodySmall" style={{fontWeight: 600}} />
            <FormGroup>
              <Controller
                name="country_of_origin"
                control={control}
                render={({field: {onChange, name, value}}) => (
                  <Dropdown
                    onChange={onChange}
                    value={value}
                    label="DRŽAVA:"
                    name={name}
                    options={countryOptions}
                    isRequired
                    error={errors.country_of_origin?.message}
                    placeholder="Izaberite državu"
                    isSearchable
                  />
                )}
              />
            </FormGroup>
          </FormColumn>
        </Form>
      }
    />
  );
};

export default PermitEntryModal;
