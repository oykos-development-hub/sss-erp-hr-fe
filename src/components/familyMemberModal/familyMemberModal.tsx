import {Modal, Dropdown, Input, Datepicker} from 'client-library';
import {FormWrapper, Row} from './styles';
import React, {useEffect, useMemo} from 'react';
import {FamilyMemberModalProps} from '../../screens/employees/family/types';
import {cityData, employeeRelationshipDropdownData} from '../../utils/constants';
import {formatData} from '../../screens/employees/family/utils';
import {parseDate} from '../../utils/dateUtils';
import {Controller, useForm} from 'react-hook-form';
import {UserProfileFamilyParams} from '../../types/graphql/userProfileGetFamilyTypes';
import useFamilyInsert from '../../services/graphql/userProfile/family/useFamilyInsert';
import {nationalMinorities} from '../../constants';

const initialValues: UserProfileFamilyParams = {
  id: 0,
  user_profile_id: 0,
  first_name: '',
  last_name: '',
  birth_last_name: '',
  date_of_birth: '',
  country_of_birth: '',
  city_of_birth: '',
  nationality: '',
  citizenship: '',
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
  const item = useMemo(() => {
    return selectedItem
      ? {
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
          country_of_birth: {id: selectedItem?.country_of_birth, title: selectedItem?.country_of_birth},
          citizenship: {id: selectedItem?.citizenship, title: selectedItem?.citizenship},
          gender: {id: selectedItem?.gender, title: selectedItem?.gender},
          //To-do Get user_profile_id from props when employee is selected
          user_profile_id: selectedItem?.user_profile_id,
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

  const {mutate} = useFamilyInsert();

  const country_of_birth = watch('country_of_birth');

  const countriesForDropdown = useMemo(() => {
    return countries?.map(country => {
      return {
        id: country.alpha_3_code,
        title: country.en_short_name,
      };
    });
  }, [countries]);

  const citizenshipArray = useMemo(() => {
    return countries?.map(country => {
      return {
        id: country.alpha_3_code,
        title: country.nationality,
      };
    });
  }, [countries]);

  useEffect(() => {
    if (item) {
      reset(item);
    }
  }, [item]);

  const onSubmit = (data: any) => {
    const payload = formatData(data);
    mutate(
      payload,
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
                    error={errors.employee_relationship?.message as string}
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
                    options={countriesForDropdown || []}
                    error={errors.country_of_birth?.message as string}
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
                    error={errors.insurance_coverage?.message as string}
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
                    error={errors.handicapped_person?.message as string}
                  />
                );
              }}
            />
          </Row>
          <Row>
            <Input
              {...register('first_name', {required: 'Ovo polje je obavezno'})}
              label="IME:"
              error={errors.first_name?.message as string}
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
                    options={citizenshipArray || []}
                    error={errors.citizenship?.message as string}
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
                    options={citizenshipArray || []}
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
                    label="NACIONALNA MANJINJA:"
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
              error={errors.last_name?.message as string}
            />
            {country_of_birth?.title === 'Montenegro' ? (
              <Controller
                name="city_of_birth"
                rules={{required: 'Ovo polje je obavezno'}}
                control={control}
                render={({field: {onChange, name, value}}) => {
                  const valueToUse = typeof value === 'string' ? {id: value, title: value} : null;
                  return (
                    <Dropdown
                      onChange={onChange}
                      value={valueToUse || value}
                      name={name}
                      label="OPŠTINA:"
                      options={cityData}
                      error={errors.city_of_birth?.message as string}
                    />
                  );
                }}
              />
            ) : (
              <Input
                {...register('city_of_birth', {required: 'Ovo polje je obavezno'})}
                label="OPŠTINA:"
                error={errors.city_of_birth?.message as string}
              />
            )}
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
                    error={errors.gender?.message as string}
                  />
                );
              }}
            />
            <Input
              {...register('father_name', {required: 'Ovo polje je obavezno'})}
              label="IME OCA:"
              error={errors.father_name?.message as string}
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
                  error={errors.date_of_birth?.message as string}
                />
              )}
            />
            <Input
              {...register('mother_name', {required: 'Ovo polje je obavezno'})}
              label="IME MAJKE:"
              error={errors.mother_name?.message as string}
            />
          </Row>
          <Row>
            <Input
              {...register('official_personal_id', {required: 'Ovo polje je obavezno'})}
              label="JMBG:"
              error={errors.official_personal_id?.message as string}
            />
            <Input {...register('mother_birth_last_name')} label="PREZIME PO ROĐENJU:" />
          </Row>
        </FormWrapper>
      }
      title={'DODAJTE ČLANA PORODICE'}
    />
  );
};
