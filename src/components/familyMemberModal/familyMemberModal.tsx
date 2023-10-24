import {Datepicker, Dropdown, Input, Modal} from 'client-library';
import React, {useEffect, useMemo} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {nationalMinorities} from '../../constants';
import {FamilyMemberModalProps} from '../../screens/employees/family/types';
import {formatData} from '../../screens/employees/family/utils';
import useInsertFamily from '../../services/graphql/userProfile/family/useInsertFamily';
import {cityData, employeeRelationshipDropdownData} from '../../utils/constants';
import {FormWrapper, Row} from './styles';
import {parseToDate} from '../../utils/dateUtils';
import {ProfileFamilyParams} from '../../types/graphql/family';

const initialValues: ProfileFamilyParams = {
  id: 0,
  user_profile_id: 0,
  first_name: '',
  last_name: '',
  date_of_birth: null,
  country_of_birth: null,
  city_of_birth: '',
  nationality: null,
  citizenship: null,
  address: '',
  father_name: '',
  mother_name: '',
  mother_birth_last_name: '',
  official_personal_id: '',
  gender: '',
  insurance_coverage: '',
  handicapped_person: false,
  employee_relationship: '',
  national_minority: null,
};

export const FamilyMemberModal: React.FC<FamilyMemberModalProps> = ({
  selectedItem,
  open,
  onClose,
  countries,
  userProfileId,
  alert,
  refetch,
}) => {
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: {errors, dirtyFields},
    reset,
    resetField,
  } = useForm({defaultValues: initialValues});

  const {insertFamily, loading: isSaving} = useInsertFamily();

  const country_of_birth = watch('country_of_birth');
  const countryIsMontenegro = country_of_birth?.id === 'mne';

  const countryOptions = useMemo(() => {
    return (
      countries?.map(country => {
        return {
          id: country.alpha3,
          title: country.name,
        };
      }) || []
    );
  }, [countries]);

  useEffect(() => {
    if (selectedItem) {
      reset({
        ...selectedItem,
        handicapped_person: {
          id: selectedItem?.handicapped_person ? 'Da' : 'Ne',
          title: selectedItem?.handicapped_person ? 'Da' : 'Ne',
        },
        insurance_coverage: {
          id: selectedItem?.insurance_coverage === 'Ne' ? 'Ne' : 'Da',
          title: selectedItem?.insurance_coverage === 'Ne' ? 'Ne' : 'Da',
        },
        employee_relationship: {id: selectedItem?.employee_relationship, title: selectedItem?.employee_relationship},
        country_of_birth: countryOptions?.find(country => country.id === selectedItem?.country_of_birth),
        citizenship: countryOptions?.find(country => country.id === selectedItem?.citizenship),
        gender: {id: selectedItem?.gender, title: selectedItem?.gender},
        date_of_birth: parseToDate(selectedItem?.date_of_birth),
        national_minority: nationalMinorities?.find(nm => nm.id === selectedItem.national_minority),
        nationality: countryOptions?.find(c => c.title === selectedItem.nationality),
        city_of_birth:
          selectedItem.country_of_birth !== 'mne'
            ? selectedItem.city_of_birth
            : cityData.find(city => city.id === selectedItem.city_of_birth),
      });
    }
  }, [selectedItem]);

  useEffect(() => {
    if (countryIsMontenegro && dirtyFields.country_of_birth) {
      resetField('city_of_birth', {defaultValue: ''});
    }
  }, [country_of_birth]);

  const onSubmit = (data: any) => {
    if (isSaving) return;

    const payload = formatData(data);
    insertFamily(
      {...payload, user_profile_id: userProfileId || 0},
      () => {
        alert.success('Uspješno sačuvano.');
        refetch();
        onClose();
      },
      () => {
        alert.error('Greška. Promjene nisu sačuvane.');
        onClose();
      },
    );
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
      buttonLoading={isSaving}
      content={
        <FormWrapper>
          <Row>
            <Controller
              name="employee_relationship"
              rules={{required: 'Ovo polje je obavezno'}}
              control={control}
              render={({field: {onChange, name, value}}) => {
                return (
                  <Dropdown
                    onChange={onChange}
                    value={value as any}
                    name={name}
                    label="SRODSTVO:"
                    options={employeeRelationshipDropdownData}
                    error={errors.employee_relationship?.message}
                  />
                );
              }}
            />
            <Controller
              name="country_of_birth"
              rules={{required: 'Ovo polje je obavezno'}}
              control={control}
              render={({field: {onChange, name, value}}) => {
                return (
                  <Dropdown
                    onChange={onChange}
                    value={value as any}
                    name={name}
                    isSearchable
                    label="DRŽAVA ROĐENJA:"
                    options={countryOptions}
                    error={errors.country_of_birth?.message}
                  />
                );
              }}
            />
            <Controller
              name="insurance_coverage"
              rules={{required: 'Ovo polje je obavezno'}}
              control={control}
              render={({field: {onChange, name, value}}) => {
                return (
                  <Dropdown
                    onChange={onChange}
                    value={value as any}
                    name={name}
                    label="KORISNIK OSIGURANJA:"
                    options={[
                      {id: 'Da', title: 'Da'},
                      {id: 'Ne', title: 'Ne'},
                    ]}
                    error={errors.insurance_coverage?.message}
                  />
                );
              }}
            />
            <Controller
              name="handicapped_person"
              rules={{required: 'Ovo polje je obavezno'}}
              control={control}
              render={({field: {onChange, name, value}}) => {
                return (
                  <Dropdown
                    onChange={onChange}
                    value={value as any}
                    name={name}
                    label="LICE SA INVALIDITETOM:"
                    options={[
                      {id: 'Da', title: 'Da'},
                      {id: 'Ne', title: 'Ne'},
                    ]}
                    error={errors.handicapped_person?.message}
                  />
                );
              }}
            />
          </Row>
          <Row>
            <Input
              {...register('first_name', {required: 'Ovo polje je obavezno'})}
              label="IME:"
              error={errors.first_name?.message}
            />
            <Controller
              name="citizenship"
              rules={{required: 'Ovo polje je obavezno'}}
              control={control}
              render={({field: {onChange, name, value}}) => {
                return (
                  <Dropdown
                    onChange={onChange}
                    value={value as any}
                    name={name}
                    label="DRŽAVLJANSTVO:"
                    options={countryOptions}
                    error={errors.citizenship?.message}
                    isSearchable
                  />
                );
              }}
            />
            <Controller
              name="nationality"
              control={control}
              render={({field: {onChange, name, value}}) => {
                return (
                  <Dropdown
                    onChange={onChange}
                    value={value as any}
                    name={name}
                    label="NACIONALNOST:"
                    options={countryOptions}
                    isSearchable
                  />
                );
              }}
            />
            <Controller
              name="national_minority"
              control={control}
              render={({field: {onChange, name, value}}) => {
                return (
                  <Dropdown
                    onChange={onChange}
                    value={value as any}
                    name={name}
                    label="NACIONALNA MANJINA:"
                    options={nationalMinorities || []}
                  />
                );
              }}
            />
          </Row>
          <Row>
            <Input
              {...register('last_name', {required: 'Ovo polje je obavezno'})}
              label="PREZIME:"
              error={errors.last_name?.message}
            />
            <Controller
              name="city_of_birth"
              rules={{
                validate: (value: any) =>
                  (!value && country_of_birth?.id === 'MNE') || country_of_birth?.title === null
                    ? 'Ovo polje je obavezno'
                    : true,
              }}
              control={control}
              render={({field: {onChange, name, value}}) => {
                return countryIsMontenegro ? (
                  <Dropdown
                    onChange={onChange}
                    value={value as any}
                    name={name}
                    label="OPŠTINA:"
                    options={cityData}
                    error={errors.city_of_birth?.message}
                    isSearchable
                  />
                ) : (
                  <Input
                    {...register('city_of_birth', {
                      validate: (value: any) =>
                        (!value && countryIsMontenegro) || country_of_birth?.title === ''
                          ? 'Ovo polje je obavezno'
                          : true,
                    })}
                    label="OPŠTINA:"
                    error={errors.city_of_birth?.message}
                  />
                );
              }}
            />

            <Input {...register('address')} label="ADRESA:" />
          </Row>
          <Row>
            <Controller
              name="gender"
              rules={{required: 'Ovo polje je obavezno'}}
              control={control}
              render={({field: {onChange, name, value}}) => {
                return (
                  <Dropdown
                    onChange={onChange}
                    value={value as any}
                    name={name}
                    label="POL:"
                    options={[
                      {id: 'Muški', title: 'Muški'},
                      {id: 'Ženski', title: 'Ženski'},
                    ]}
                    error={errors.gender?.message}
                  />
                );
              }}
            />
            <Input
              {...register('father_name', {required: 'Ovo polje je obavezno'})}
              label="IME OCA:"
              error={errors.father_name?.message}
            />
          </Row>
          <Row>
            <Controller
              name="date_of_birth"
              control={control}
              rules={{required: 'Ovo polje je obavezno'}}
              render={({field: {onChange, name, value}}) => (
                <Datepicker
                  onChange={onChange}
                  label="DATUM ROĐENJA:"
                  name={name}
                  selected={value ? new Date(value) : ''}
                  error={errors.date_of_birth?.message}
                />
              )}
            />
            <Input
              {...register('mother_name', {required: 'Ovo polje je obavezno'})}
              label="IME MAJKE:"
              error={errors.mother_name?.message}
            />
          </Row>
          <Row>
            <Input
              {...register('official_personal_id', {required: 'Ovo polje je obavezno'})}
              label="JMBG:"
              error={errors.official_personal_id?.message}
            />
            <Input {...register('mother_birth_last_name')} label="PREZIME PO ROĐENJU:" />
          </Row>
        </FormWrapper>
      }
      title={'DODAJTE ČLANA PORODICE'}
    />
  );
};
