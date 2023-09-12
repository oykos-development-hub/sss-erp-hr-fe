import {Checkbox, Datepicker, Dropdown, Input} from 'client-library';
import React, {useEffect, useMemo} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {cityData} from '../../constants';
import useForeignerPermitInsert from '../../services/graphql/foreignerPermits/useForeignerPermitInsert';
import {ForeignerPermit, ForeignerPermitFormValues} from '../../types/graphql/foreignerPermits';
import {CheckboxContainer, CheckboxLabel, ColumnTitle, Form, FormColumn, FormGroup, PermitModal} from './styles';
import {parseDateForBackend, parseToDate} from '../../utils/dateUtils';

interface PermitEntryModalProps {
  open: boolean;
  onClose: () => void;
  permitData?: ForeignerPermit | null;
  id: number;
  refetchList: () => void;
  countries: any[];
  alert: any;
}

const initialValues: ForeignerPermitFormValues = {
  user_profile_id: null,
  work_permit_number: '',
  work_permit_issuer: '',
  work_permit_date_of_start: null,
  work_permit_date_of_end: null,
  work_permit_indefinite_length: false,
  residence_permit_date_of_end: null,
  residence_permit_indefinite_length: false,
  residence_permit_number: '',
  country_of_origin: '',
  work_permit_file_id: null,
  residence_permit_file_id: null,
};

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
        id: country.alpha_3_code,
        title: country.en_short_name,
      };
    });
  }, [countries]);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: {errors},
    setValue,
    reset,
  } = useForm({defaultValues: initialValues});

  const indefinite = watch('residence_permit_indefinite_length');

  const {mutate, loading: isSaving} = useForeignerPermitInsert();

  useEffect(() => {
    if (permitData) {
      const editData = {
        ...permitData,
        country_of_origin: countryOptions.find((country: any) => country.id === permitData.country_of_origin),
        work_permit_issuer: cityData.find((city: any) => city.id === permitData.work_permit_issuer),
        work_permit_date_of_start: parseToDate(permitData.work_permit_date_of_start),
        work_permit_date_of_end: parseToDate(permitData.work_permit_date_of_end),
        residence_permit_date_of_end: parseToDate(permitData.residence_permit_date_of_end),
      };

      reset(editData);
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
      work_permit_date_of_end: parseDateForBackend(values.work_permit_date_of_end),
      residence_permit_date_of_end: parseDateForBackend(values.residence_permit_date_of_end),
      residence_permit_file_id: values.residence_permit_file_id || 0,
      work_permit_file_id: values.work_permit_file_id || 0,
    };

    try {
      mutate(data, () => {
        refetchList();
        alert.success('Uspješno sačuvano.');
        onClose();
        reset(initialValues);
      });
    } catch (e) {
      alert.error('Greška. Promjene nisu sačuvane.');
      console.log(e);
    }
  };

  return (
    <PermitModal
      onClose={onClose}
      open={open}
      title="DODAJTE DOZVOLU"
      style={{width: '1020px'}}
      rightButtonOnClick={handleSubmit(onSubmit)}
      buttonLoading={isSaving}
      content={
        <Form>
          <FormColumn>
            <ColumnTitle content="PODACI O RADNOJ DOZVOLI" variant="bodySmall" style={{fontWeight: 600}} />
            <FormGroup>
              <Input
                {...register('work_permit_number', {required: 'Ovo polje je obavezno'})}
                label="BROJ:"
                error={errors.work_permit_number?.message as string}
                placeholder="Unesite broj radne dozvole"
              />
            </FormGroup>
            <FormGroup>
              <Controller
                name="work_permit_issuer"
                rules={{required: 'Ovo polje je obavezno'}}
                control={control}
                render={({field: {onChange, name, value}}) => (
                  <Dropdown
                    onChange={onChange}
                    value={value as any}
                    name={name}
                    label="IZDAVALAC:"
                    options={cityData}
                    error={errors.work_permit_issuer?.message as string}
                    placeholder="Izaberite izdavaoca"
                  />
                )}
              />
            </FormGroup>
            <FormGroup>
              <Controller
                name="work_permit_date_of_start"
                control={control}
                rules={{required: 'Ovo polje je obavezno'}}
                render={({field: {onChange, name, value}}) => (
                  <Datepicker
                    onChange={onChange}
                    label="VAŽI OD:"
                    name={name}
                    selected={value}
                    error={errors.work_permit_date_of_start?.message as string}
                  />
                )}
              />
            </FormGroup>
            <FormGroup>
              <Controller
                name="work_permit_date_of_end"
                control={control}
                rules={{required: {value: !indefinite, message: 'Ovo polje je obavezno'}}}
                render={({field: {onChange, name, value}}) => {
                  return (
                    <Datepicker
                      onChange={onChange}
                      label="VAŽI DO:"
                      name={name}
                      selected={value}
                      error={errors.work_permit_date_of_end?.message as string}
                      disabled={indefinite}
                    />
                  );
                }}
              />
            </FormGroup>

            <Controller
              name="residence_permit_indefinite_length"
              control={control}
              render={({field: {name, value}}) => {
                return (
                  <CheckboxContainer>
                    <Checkbox
                      onChange={() => setValue('residence_permit_indefinite_length', !value)}
                      name={name}
                      checked={value}
                    />
                    <CheckboxLabel content="Neograničeno Trajanje" variant="bodySmall" />
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
                error={errors.residence_permit_number?.message as string}
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
                    error={errors.residence_permit_date_of_end?.message as string}
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
                rules={{required: 'Ovo polje je obavezno'}}
                render={({field: {onChange, name, value}}) => (
                  <Dropdown
                    onChange={onChange}
                    value={value as any}
                    label="DRŽAVA:"
                    name={name}
                    options={countryOptions}
                    error={errors.residence_permit_date_of_end?.message as string}
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
