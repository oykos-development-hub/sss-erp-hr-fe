import React, {useEffect, useMemo, useState} from 'react';
import {
  FormContainer,
  FormColumn,
  FormFooter,
  FormWrapper,
  FormRow,
  FormItem,
  FormFileUpload,
  Controls,
  TextWrapper,
} from './styles';
import {Typography, Input, Button, Dropdown, Datepicker} from 'client-library';
import {BasicInfoPageProps} from './types';
import {
  cityData,
  contractTypes,
  departmentOptions,
  femaleMaritalStatusOptions,
  genderOptions,
  maleMaritalStatusOptions,
  nationalMinorities,
  yesOrNoOptionsString,
} from '../../../constants';
import {Controller, useForm} from 'react-hook-form';
import {UserProfileBasicInfo} from '../../../types/graphql/userProfiles';
import {parseDate} from '../../../utils/dateUtils';
import useOrganizationUnits from '../../../services/graphql/organizationUnits/useOrganizationUnits';
import {initialValues} from './constants';
import useJobPositions from '../../../services/graphql/jobPositions/useJobPositionOverview';
import {formatData} from './utils';
import useBasicInfoGet from '../../../services/graphql/userProfile/basicInfo/useBasicInfoGet';
import useBasicInfoInsert from '../../../services/graphql/userProfile/basicInfo/useBasicInfoInsert';

//TODO For the department field (odjeljenje), create an option for fetching all the departments of a certain organization unit (by its ID) in the BFF
//TODO Fix checkbox to work in the react hook form without the reset function
//TODO Fix all as any down below (and in rest of the forms)
//TODO Make name prop on the dropdown and datepicker to be optional

export const BasicInfo: React.FC<BasicInfoPageProps> = ({context}) => {
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const {data: profileData, refetch} = useBasicInfoGet(context.navigation.location.pathname.split('/')[3]);
  const {data: jobPositions} = useJobPositions();
  const {organizationUnitsList} = useOrganizationUnits();
  const {mutate} = useBasicInfoInsert();

  const {
    register,
    handleSubmit,
    formState: {errors, isValid},
    reset,
    control,
    watch,
  } = useForm({
    defaultValues: profileData || initialValues,
  });

  const onFileUpload = (acceptedFiles: FileList) => {
    console.log('File(s) uploaded:', acceptedFiles);
  };

  const handleSave = (values: UserProfileBasicInfo, close: boolean) => {
    if (isValid) {
      mutate(
        formatData(values),
        () => {
          refetch();
          context.alert.success('Čuvanje podataka uspješno');
          setIsDisabled(true);

          if (close) {
            const overviewPathname = context.navigation.location.pathname.split('/').slice(0, 3).join('/');
            context.navigation.navigate(overviewPathname);
          }
        },
        () => {
          context.alert.error('Greška prilikom čuvanja podataka');
        },
      );
    }
  };

  const jobPositionOptions = useMemo(() => {
    return jobPositions.items.map((jobPosition: any) => ({id: jobPosition.id, title: jobPosition.title}));
  }, [jobPositions]);

  const countryOptions = useMemo(() => {
    return context.countries?.map((country: any) => {
      return {
        id: country.alpha_3_code,
        title: country.en_short_name,
      };
    });
  }, [context.countries]);

  const citizenshipArray = useMemo(() => {
    return context.countries?.map((country: any) => {
      return {
        id: country.alpha_3_code,
        title: country.nationality,
      };
    });
  }, [context.countries]);

  useEffect(() => {
    refetch();

    // If new employee, enable the form immediately
    if (context.navigation.location.pathname.split('/')[3] === 'new-employee') {
      setIsDisabled(false);
    }
  }, [context.navigation.location]);

  useEffect(() => {
    reset(profileData);
  }, [profileData]);

  // When coming from the job tender applications, when changing an external candidates status to accepted, it leads here to create it in the system, basically becoming an internal candidate in order to be accepted
  useEffect(() => {
    if (!context.navigation.location.state) return;
    reset({
      ...initialValues,
      ...context.navigation.location.state.user,
    });
  }, [context.navigation.location.state]);

  const gender = watch('gender')['id' as any];
  const maritalOptions = gender === 'muski' ? maleMaritalStatusOptions : femaleMaritalStatusOptions;

  return (
    <FormContainer>
      <FormWrapper>
        <TextWrapper>
          <Typography content="PERSONALNI PODACI" variant="bodyMedium" />
        </TextWrapper>

        <FormRow>
          <FormColumn>
            <FormItem>
              <Input
                {...register('first_name', {required: 'Ovo polje je obavezno'})}
                label="IME:"
                disabled={isDisabled}
                error={errors.first_name?.message}
              />
            </FormItem>
            <FormItem>
              <Input
                {...register('last_name', {required: 'Ovo polje je obavezno'})}
                label="PREZIME"
                disabled={isDisabled}
                error={errors.last_name?.message}
              />
            </FormItem>
            <FormItem>
              <Controller
                name="gender"
                control={control}
                render={({field: {onChange, name, value}}) => (
                  <Dropdown
                    name={name}
                    label="POL:"
                    value={value as any}
                    options={genderOptions}
                    isDisabled={isDisabled}
                    onChange={onChange}
                    error={errors.gender?.message}
                  />
                )}
              />
            </FormItem>
            <FormItem>
              <Input
                {...register('official_personal_id', {required: 'Ovo polje je obavezno'})}
                label="JMBG:"
                disabled={isDisabled}
                error={errors.official_personal_id?.message}
              />
            </FormItem>
            <FormItem>
              <Input
                {...register('official_personal_document_number', {required: 'Ovo polje je obavezno'})}
                label="BROJ LIČNE KARTE:"
                disabled={isDisabled}
                error={errors.official_personal_document_number?.message}
              />
            </FormItem>
            <FormItem>
              <Controller
                name="official_personal_document_issuer"
                control={control}
                render={({field: {onChange, name, value}}) => (
                  <Dropdown
                    name={name}
                    label="PJ LIČNE KARTE:"
                    value={value as any}
                    options={cityData}
                    isDisabled={isDisabled}
                    onChange={onChange}
                    error={errors.official_personal_document_issuer?.message}
                  />
                )}
              />
            </FormItem>
          </FormColumn>

          <FormColumn>
            <FormItem>
              <Controller
                name="date_of_birth"
                rules={{required: 'Ovo polje je obavezno'}}
                control={control}
                render={({field: {onChange, name, value}}) => (
                  <Datepicker
                    name={name}
                    value={value ? parseDate(value) : ''}
                    onChange={onChange}
                    label="DATUM ROĐENJA:"
                    disabled={isDisabled}
                    error={errors.date_of_birth?.message}
                  />
                )}
              />
            </FormItem>
            <FormItem>
              <Controller
                name="country_of_birth"
                control={control}
                render={({field: {onChange, name, value}}) => (
                  <Dropdown
                    name={name}
                    label="DRŽAVA ROĐENJA:"
                    onChange={onChange}
                    value={value as any}
                    isDisabled={isDisabled}
                    options={countryOptions}
                    error={errors.date_of_birth?.message}
                  />
                )}
              />
            </FormItem>
            <FormItem>
              <Controller
                name="citizenship"
                rules={{required: 'Ovo polje je obavezno'}}
                control={control}
                render={({field: {onChange, name, value}}) => (
                  <Dropdown
                    name={name}
                    onChange={onChange}
                    label="DRŽAVLJANSTVO:"
                    value={value as any}
                    options={citizenshipArray}
                    isDisabled={isDisabled}
                    error={errors.nationality?.message}
                  />
                )}
              />
            </FormItem>
            <FormItem>
              <Input {...register('city_of_birth')} label="OPŠTINA ROĐENJA:" disabled={isDisabled} />
            </FormItem>
            <FormItem>
              <Controller
                name="national_minority"
                control={control}
                render={({field: {onChange, name, value}}) => (
                  <Dropdown
                    name={name}
                    label="PRIPADNOST NACIONALNOJ MANJINI:"
                    onChange={onChange}
                    noOptionsText="Prazno"
                    value={value as any}
                    options={nationalMinorities}
                    isDisabled={isDisabled}
                    error={errors.national_minority?.message}
                  />
                )}
              />
            </FormItem>
            <FormItem>
              <Input
                {...register('address')}
                label="ADRESA STANOVANJA:"
                disabled={isDisabled}
                error={errors.address?.message}
              />
            </FormItem>
          </FormColumn>

          <FormColumn>
            <FormItem>
              <Input
                {...register('father_name')}
                label="IME OCA:"
                disabled={isDisabled}
                error={errors.father_name?.message}
              />
            </FormItem>
            <FormItem>
              <Input
                {...register('mother_name')}
                label="IME MAJKE:"
                disabled={isDisabled}
                error={errors.mother_name?.message}
              />
            </FormItem>
            <FormItem>
              <Input
                {...register('birth_last_name')}
                label="PREZIME PO ROĐENJU:"
                disabled={isDisabled}
                error={errors.birth_last_name?.message}
              />
            </FormItem>
          </FormColumn>

          <FormColumn>
            <FormItem>
              <Controller
                name="marital_status"
                control={control}
                render={({field: {onChange, name, value}}) => (
                  <Dropdown
                    name={name}
                    label="BRAČNO STANJE:"
                    value={value as any}
                    onChange={onChange}
                    options={maritalOptions}
                    isDisabled={isDisabled}
                    error={errors.marital_status?.message}
                  />
                )}
              />
            </FormItem>
            <FormItem>
              <Controller
                name="single_parent"
                control={control}
                render={({field: {onChange, name, value}}) => (
                  <Dropdown
                    name={name}
                    label="SAMOHRANI RODITELJ:"
                    value={value as any}
                    options={yesOrNoOptionsString as any}
                    isDisabled={isDisabled}
                    error={errors.single_parent?.message}
                    onChange={onChange}
                  />
                )}
              />
            </FormItem>
            <FormItem>
              <Controller
                name="housing_done"
                control={control}
                render={({field: {onChange, name, value}}) => (
                  <Dropdown
                    name={name}
                    label="RIJEŠENO STAMBENO PITANJE:"
                    value={value as any}
                    options={yesOrNoOptionsString as any}
                    isDisabled={isDisabled}
                    onChange={onChange}
                    error={errors.housing_done?.message}
                  />
                )}
              />
            </FormItem>
            <FormItem>
              <Input
                {...register('housing_description')}
                label="OPIS STAMBENOG PITANJA:"
                disabled={isDisabled}
                error={errors.housing_description?.message}
              />
            </FormItem>
          </FormColumn>
        </FormRow>
      </FormWrapper>

      <FormWrapper>
        <TextWrapper>
          <Typography content="PODACI O ZAPOSLENJU" variant="bodyMedium" />
        </TextWrapper>

        <FormRow>
          <FormColumn>
            <FormItem>
              <Controller
                name="organization_unit_id"
                rules={{required: 'Ovo polje je obavezno'}}
                control={control}
                render={({field: {onChange, name, value}}) => (
                  <Dropdown
                    name={name}
                    onChange={onChange}
                    label="ORGANIZACIONA JEDINICA:"
                    isDisabled={isDisabled}
                    value={value as any}
                    options={organizationUnitsList as any}
                    error={errors.organization_unit_id?.message}
                  />
                )}
              />
            </FormItem>
            <FormItem>
              <Controller
                name="organization_unit_department_id"
                control={control}
                render={({field: {onChange, name, value}}) => (
                  <Dropdown
                    name={name}
                    label="ODJELJENJE:"
                    value={value as any}
                    onChange={onChange}
                    noOptionsText="Prazno"
                    options={departmentOptions as any}
                    isDisabled={isDisabled}
                    error={errors.organization_unit_id?.message}
                  />
                )}
              />
            </FormItem>
            <FormItem>
              <Controller
                name="job_position_id"
                rules={{required: 'Ovo polje je obavezno'}}
                control={control}
                render={({field: {onChange, name, value}}) => (
                  <Dropdown
                    name={name}
                    onChange={onChange}
                    label="RADNO MJESTO:"
                    value={value as any}
                    noOptionsText="Prazno"
                    options={jobPositionOptions}
                    isDisabled={isDisabled}
                    error={errors.job_position_id?.message}
                  />
                )}
              />
            </FormItem>
          </FormColumn>

          <FormColumn>
            <FormItem>
              <Controller
                name="contract_type_id"
                rules={{required: 'Ovo polje je obavezno'}}
                control={control}
                render={({field: {onChange, name, value}}) => (
                  <Dropdown
                    name={name}
                    label="VRSTA UGOVORA:"
                    onChange={onChange}
                    value={value as any}
                    noOptionsText="Prazno"
                    options={contractTypes}
                    isDisabled={isDisabled}
                    error={errors.contract_type_id?.message}
                  />
                )}
              />
            </FormItem>
            <FormItem>
              <Controller
                name="date_of_becoming_judge"
                rules={{required: 'Ovo polje je obavezno'}}
                control={control}
                render={({field: {onChange, name, value}}) => (
                  <Datepicker
                    name={name}
                    value={value ? parseDate(value) : ''}
                    onChange={onChange}
                    label="DATUM IZBORA:"
                    disabled={isDisabled}
                    error={errors.date_of_becoming_judge?.message}
                  />
                )}
              />
            </FormItem>
            <FormItem>
              <FormFileUpload
                onUpload={onFileUpload}
                variant="secondary"
                buttonVariant="primary"
                buttonText="UČITAJ"
                buttonSize={'sm'}
                icon={<></>}
                note={<Typography variant="bodySmall" content="Ugovor o radu" />}
                disabled={isDisabled}
              />
            </FormItem>
          </FormColumn>

          <FormColumn>
            <FormItem>
              <Controller
                name="date_of_start"
                rules={{required: 'Ovo polje je obavezno'}}
                control={control}
                render={({field: {onChange, name, value}}) => (
                  <Datepicker
                    name={name}
                    label="POČETAK RADNOG ODNOSA:"
                    value={value ? parseDate(value) : ''}
                    onChange={onChange}
                    disabled={isDisabled}
                    error={errors.date_of_start?.message}
                  />
                )}
              />
            </FormItem>

            <FormItem>
              <Controller
                name="date_of_end"
                rules={{
                  validate: value =>
                    !value || !watch('date_of_start') || new Date(value) >= new Date(watch('date_of_start'))
                      ? true
                      : 'Kraj radnog odnosa ne može biti prije početka radnog odnosa.',
                }}
                control={control}
                render={({field: {onChange, name, value}}) => (
                  <Datepicker
                    name={name}
                    label="KRAJ RADNOG ODNOSA:"
                    value={value ? parseDate(value) : ''}
                    onChange={onChange}
                    disabled={isDisabled}
                    error={errors.date_of_end?.message}
                  />
                )}
              />
            </FormItem>
            <FormItem>
              <Button
                size="lg"
                content={<Typography variant="bodyMedium" content="Prekid radnog odnosa:" />}
                disabled={isDisabled}
              />
            </FormItem>
          </FormColumn>
        </FormRow>
      </FormWrapper>

      <FormWrapper>
        <TextWrapper>
          <Typography content="KORISNIČKI NALOG" variant="bodyMedium" />
        </TextWrapper>

        <FormRow style={{paddingBottom: 0}}>
          <FormColumn style={{flexBasis: 'calc(50% + 23px)'}}>
            <FormItem>
              {/* TODO value prop needs to be number also */}
              <Input {...register('user_profile_id')} label="SISTEMSKI ID:" disabled={true} />
            </FormItem>
          </FormColumn>
        </FormRow>

        <FormRow style={{padding: 0}}>
          <FormColumn>
            <FormItem>
              <Input {...register('email')} label="E-MAIL:" disabled={isDisabled} />
            </FormItem>
            <FormItem>
              <Input
                {...register('password', {required: 'Ovo polje je obavezno'})}
                label="LOZINKA:"
                type="password"
                placeholder="******"
                disabled={isDisabled}
              />
            </FormItem>
            <FormItem>
              <Input
                {...register('phone', {required: 'Ovo polje je obavezno'})}
                label="BROJ TELEFONA:"
                disabled={isDisabled}
              />
            </FormItem>
          </FormColumn>

          <FormColumn>
            <FormItem>
              <Input {...register('private_email')} label="PRIVATNI E-MAIL:" disabled={isDisabled} />
            </FormItem>
            <FormItem>
              <Input
                {...register('pin', {required: 'Ovo polje je obavezno'})}
                type="number"
                maxLength={4}
                label="PIN:"
                disabled={isDisabled}
              />
            </FormItem>
          </FormColumn>
        </FormRow>
      </FormWrapper>

      <FormFooter>
        <Controls>
          {isDisabled ? (
            <Button content="Uredi" variant="secondary" onClick={() => setIsDisabled(false)} />
          ) : (
            <>
              <Button
                content="Sačuvaj i zatvori"
                variant="secondary"
                onClick={() => handleSubmit((data: UserProfileBasicInfo) => handleSave(data, true))()}
              />
              <Button
                content="Sačuvaj i nastavi"
                variant="primary"
                onClick={() => handleSubmit((data: UserProfileBasicInfo) => handleSave(data, false))()}
              />
            </>
          )}
        </Controls>
      </FormFooter>
    </FormContainer>
  );
};
