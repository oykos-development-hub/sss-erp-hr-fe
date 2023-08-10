import React, {useEffect, useMemo} from 'react';
import {Input, Dropdown, Datepicker, Checkbox} from 'client-library';
import {CheckboxContainer, CheckboxLabel, ColumnTitle, Form, FormColumn, FormGroup, PermitModal} from './styles';
import {ForeignerPermitFormValues, ForeignerPermit} from '../../types/graphql/foreignerPermits';
import {cityData} from '../../constants';
import {Controller, useForm} from 'react-hook-form';
import {parseDate} from '../../utils/dateUtils';
import useForeignerPermitInsert from '../../services/graphql/foreignerPermits/useForeignerPermitInsert';

interface PermitEntryModalProps {
  open: boolean;
  onClose: () => void;
  permitData?: ForeignerPermit | null;
  id?: number;
  refetchList: () => void;
  countries: any[];
  alert: any;
}

const initialValues: ForeignerPermitFormValues = {
  user_profile_id: null,
  work_permit_number: '',
  work_permit_issuer: '',
  work_permit_date_of_start: '',
  work_permit_date_of_end: '',
  work_permit_indefinite_length: false,
  residence_permit_date_of_start: '',
  residence_permit_date_of_end: '',
  residence_permit_indefinite_length: false,
  residence_permit_number: '',
  residence_permit_issuer: '',
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

  const {mutate} = useForeignerPermitInsert();

  useEffect(() => {
    if (permitData) {
      reset({
        ...permitData,
        country_of_origin: countryOptions.find((country: any) => country.id === permitData.country_of_origin),
        work_permit_issuer: cityData.find((city: any) => city.id === permitData.work_permit_issuer),
      } as any);
    }
  }, [permitData]);

  const onSubmit = async (values: any) => {
    const data = {
      ...values,
      work_permit_issuer: values.work_permit_issuer.id,
      country_of_origin: values.country_of_origin.id,
      user_profile_id: 3,
      work_permit_date_of_start: parseDate(values.work_permit_date_of_start, true),
      work_permit_date_of_end: parseDate(values.work_permit_date_of_end, true),
      residence_permit_date_of_end: parseDate(values.residence_permit_date_of_end, true),
    };

    if (!permitData) {
      delete data.id;
    }

    try {
      mutate(data, () => {
        refetchList();
        alert.success('Uspješno ste dodali unos');
        // setAlert({variant: AlertVariants.success, message: 'Uspješno ste dodali unos'});
        onClose();
      });
    } catch (e) {
      alert.error('Greška prilikom dodavanja unosa');
      // setAlert({variant: AlertVariants.success, message: 'Greška prilikom dodavanja unosa'});
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
                    value={value ? parseDate(value) : ''}
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
                      value={value ? parseDate(value) : ''}
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
                    value={value ? parseDate(value) : ''}
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
