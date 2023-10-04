import {Button, Datepicker, Dropdown, Input, Typography} from 'client-library';
import React, {useEffect, useMemo, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {
  cityData,
  femaleMaritalStatusOptions,
  genderOptions,
  maleMaritalStatusOptions,
  nationalMinorities,
  yesOrNoOptionsString,
} from '../../../constants';
import useJobPositionsAvailableOrganizationUnit from '../../../services/graphql/jobPositions/useJobPositionsAvailableOrganizationUnit';
import useGetOrganizationUnits from '../../../services/graphql/organizationUnits/useGetOrganizationUnits';
import useSettingsDropdownOverview from '../../../services/graphql/settingsDropdown/useSettingsDropdownOverview';
import useBasicInfoGet from '../../../services/graphql/userProfile/basicInfo/useBasicInfoGet';
import useBasicInfoInsert from '../../../services/graphql/userProfile/basicInfo/useBasicInfoInsert';
import useBasicInfoUpdate from '../../../services/graphql/userProfile/basicInfo/useBasicInfoUpdate';
import {DropdownDataNumber, DropdownDataString} from '../../../types/dropdownData';
import {UserProfileBasicInfoFormValues} from '../../../types/graphql/userProfiles';
import {contractPositions, initialValues} from './constants';
import {
  Controls,
  FormColumn,
  FormContainer,
  FormFileUpload,
  FormFooter,
  FormItem,
  FormRow,
  FormWrapper,
  TextWrapper,
} from './styles';
import {booleanToYesOrNo, formatData, getSchema} from './utils';
import {parseToDate} from '../../../utils/dateUtils';
import {Switch} from '@oykos-development/devkit-react-ts-styled-components';
import {yupResolver} from '@hookform/resolvers/yup';
import useAppContext from '../../../context/useAppContext';
import useJudgesAvailable from '../../../services/graphql/judges/useJudgesAvailable';

export const BasicInfo: React.FC = () => {
  const context = useAppContext();

  const {data: profileData, refetch} = useBasicInfoGet(Number(context?.navigation.location.pathname.split('/')[4]));
  const isNew = !profileData?.id;
  const isJudge = profileData?.is_judge;
  const isPresident = profileData?.is_president;
  const [isDisabled, setIsDisabled] = useState<boolean>(!isNew);

  const {organizationUnits, departments} = useGetOrganizationUnits(undefined, {allOption: true});
  const {options: contractTypes} = useSettingsDropdownOverview({entity: 'contract_types'});
  const {mutate: createBasicInfo, loading: isCreating} = useBasicInfoInsert();
  const {mutate: updateBasicInfo, loading: isUpdating} = useBasicInfoUpdate();

  const {
    register,
    handleSubmit,
    formState: {errors, isValid, dirtyFields},
    reset,
    control,
    setError,
    watch,
    setValue,
    resetField,
  } = useForm({
    resolver: yupResolver(getSchema(isNew)),
  });

  const countryOptions = useMemo(() => {
    return context.countries?.map((country: any) => {
      return {
        id: country.alpha3,
        title: country.name,
      };
    });
  }, [context.countries]);

  const gender = watch('gender')?.id;
  const [contract, is_judge, is_president] = watch(['contract', 'is_judge', 'is_president']);

  const maritalOptions = gender === 'M' ? maleMaritalStatusOptions : femaleMaritalStatusOptions;

  const {checkAvailable, refetch: refetchCheckAvailable} = useJudgesAvailable();

  const {positions} = useJobPositionsAvailableOrganizationUnit(
    contract?.organization_unit_id?.id,
    contract?.department_id?.id,
    () => {
      resetField('contract.job_position_in_organization_unit_id');
    },
  );

  const departmentOptions = useMemo(() => {
    if (!contract?.organization_unit_id) return [];

    if (contract?.organization_unit_id && departments && departments.length) {
      return departments.filter((dep: any) => dep.parentId === contract.organization_unit_id?.id);
    } else {
      return departments;
    }
  }, [contract?.organization_unit_id, organizationUnits]);

  const onFileUpload = (acceptedFiles: FileList) => {
    console.log('File(s) uploaded:', acceptedFiles);
  };

  const handleSave = async (values: UserProfileBasicInfoFormValues, close: boolean) => {
    if (isValid) {
      if (!profileData?.id) {
        if (isCreating) return;

        await createBasicInfo(
          formatData(values),
          userId => {
            refetch();
            context.alert.success('Uspješno sačuvano.');
            setIsDisabled(true);

            if (close) {
              const overviewPathname = context.navigation.location.pathname.split('/').slice(0, 3).join('/');
              context.navigation.navigate(overviewPathname);
            }

            context.navigation.navigate(`/hr/employees/details/${userId}/basic-info`, {state: {scroll: true}});
          },

          res => {
            setError('email', {
              type: 'custom',
              message: res.message,
            });

            context.alert.error('Greška. Promjene nisu sačuvane.');
          },
        );
      } else {
        if (isUpdating) return;

        updateBasicInfo(
          formatData(values),
          () => {
            refetch();
            context.alert.success('Uspješno sačuvano.');
            setIsDisabled(true);

            if (close) {
              const overviewPathname = context.navigation.location.pathname.split('/').slice(0, 3).join('/');
              context.navigation.navigate(overviewPathname);
            }
          },
          () => {
            context.alert.error('Greška. Promjene nisu sačuvane.');
          },
        );
      }
    }
  };

  useEffect(() => {
    refetch();
    // If new employee, enable the form immediately
    if (context.navigation.location.pathname.split('/')[3] === 'new-employee') {
      setIsDisabled(false);
    }
  }, [context.navigation.location]);

  useEffect(() => {
    if (profileData) {
      reset({
        ...profileData,
        nationality: countryOptions.find((opt: DropdownDataString) => opt.id === profileData.nationality),
        citizenship: countryOptions.find((opt: DropdownDataString) => opt.id === profileData.citizenship),
        date_of_birth: parseToDate(profileData?.date_of_birth),
        date_of_becoming_judge: parseToDate(profileData?.date_of_becoming_judge),
        marital_status: maritalOptions.find(opt => opt.id === profileData?.marital_status),
        country_of_birth: countryOptions.find((opt: DropdownDataString) => opt.id === profileData?.country_of_birth),
        city_of_birth: profileData?.city_of_birth,
        housing_done: booleanToYesOrNo(profileData?.housing_done),
        single_parent: booleanToYesOrNo(profileData?.single_parent),
        gender: genderOptions.find((opt: DropdownDataString) => opt.id === profileData?.gender),
        is_president: profileData?.is_president,
        national_minority: nationalMinorities.find(
          (opt: DropdownDataString) => opt.id === profileData?.national_minority,
        ),
        official_personal_document_issuer: cityData.find(
          (opt: DropdownDataString) => opt.id === profileData?.official_personal_document_issuer,
        ),
        personal_id: profileData?.personal_id ?? '',
        contract: {
          organization_unit_id: profileData?.contract?.organization_unit ?? undefined,
          department_id: profileData?.contract?.department ?? undefined,
          job_position_in_organization_unit_id: profileData?.contract?.job_position_in_organization_unit ?? undefined,
          contract_type_id: profileData?.contract?.contract_type ?? undefined,
          date_of_end: parseToDate(profileData?.contract?.date_of_end),
          date_of_start: parseToDate(profileData?.contract?.date_of_start),
          date_of_eligibility: parseToDate(profileData?.contract?.date_of_eligibility),
          user_profile_id: profileData?.id,
          active: profileData?.contract?.active,
        },
      });
    }
  }, [profileData]);

  // When coming from the job tender applications, when changing an external candidates status to accepted, it leads here to create it in the system, basically becoming an internal candidate in order to be accepted
  useEffect(() => {
    if (!context.navigation.location.state) return;

    reset({
      ...initialValues,
      ...context.navigation.location.state.user,
    });
  }, [context.navigation.location.state]);

  useEffect(() => {
    if (contract?.organization_unit_id) {
      resetField('contract.department_id');
      if (
        contract?.organization_unit_id &&
        contract?.organization_unit_id?.id &&
        contract.organization_unit_id.title?.indexOf('Sudski savjet') == -1
      ) {
        refetchCheckAvailable(contract?.organization_unit_id?.id);
      }
    }
  }, [contract?.organization_unit_id]);

  useEffect(() => {
    if (dirtyFields.is_president) {
      is_president ? setValue('is_judge', true) : setValue('is_judge', false);
    }
  }, [is_president]);

  const disabledJudge = (): boolean => {
    if (contract?.organization_unit_id?.title && contract.organization_unit_id.title?.indexOf('Sudski savjet') > -1)
      return true;
    if (isJudge) return false;
    if (checkAvailable?.judge) return false;
    return true;
  };
  const disabledPresident = (): boolean => {
    if (contract?.organization_unit_id?.title && contract.organization_unit_id.title?.indexOf('Sudski savjet') > -1)
      return true;
    if (isPresident) return false;
    if (checkAvailable?.president) return false;

    return true;
  };

  const isJobPositionInputDisabled =
    isDisabled ||
    !contract?.organization_unit_id ||
    !contract?.department_id ||
    !(contract?.contract_type_id?.title && contractPositions.indexOf(contract?.contract_type_id?.title) > -1) ||
    is_judge;
  console.log(errors);
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
                {...register('first_name')}
                label="IME:"
                disabled={isDisabled}
                error={errors.first_name?.message}
              />
            </FormItem>
            <FormItem>
              <Input
                {...register('last_name')}
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
                {...register('official_personal_id')}
                label="JMBG:"
                disabled={isDisabled}
                error={errors.official_personal_id?.message}
              />
            </FormItem>
            <FormItem>
              <Input {...register('personal_id')} label="ID:" disabled={isDisabled} />
            </FormItem>
            <FormItem>
              <Input
                {...register('official_personal_document_number')}
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
                    isSearchable
                  />
                )}
              />
            </FormItem>
          </FormColumn>
          <FormColumn>
            <FormItem>
              <Controller
                name="date_of_birth"
                control={control}
                render={({field: {onChange, name, value}}) => (
                  <Datepicker
                    name={name}
                    selected={value ? new Date(value) : null}
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
                    error={errors.country_of_birth?.message}
                    isSearchable
                  />
                )}
              />
            </FormItem>
            <FormItem>
              <Controller
                name="citizenship"
                control={control}
                render={({field: {onChange, name, value}}) => (
                  <Dropdown
                    name={name}
                    onChange={onChange}
                    label="DRŽAVLJANSTVO:"
                    value={value as any}
                    options={countryOptions}
                    isDisabled={isDisabled}
                    isSearchable
                    error={errors.citizenship?.message}
                  />
                )}
              />
            </FormItem>
            <FormItem>
              <Input
                {...register('city_of_birth')}
                label="OPŠTINA ROĐENJA:"
                disabled={isDisabled}
                error={errors.city_of_birth?.message}
              />
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
              <Input {...register('birth_last_name')} label="PREZIME PO ROĐENJU:" disabled={isDisabled} />
            </FormItem>
            <FormItem>
              <Controller
                name="nationality"
                control={control}
                render={({field: {onChange, name, value}}) => (
                  <Dropdown
                    name={name}
                    label="NACIONALNOST:"
                    value={value as any}
                    onChange={onChange}
                    options={countryOptions}
                    isDisabled={isDisabled}
                    error={errors.nationality?.message}
                    isSearchable
                  />
                )}
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
                    options={yesOrNoOptionsString}
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
                    options={yesOrNoOptionsString}
                    isDisabled={isDisabled}
                    onChange={onChange}
                    error={errors.housing_done?.message}
                  />
                )}
              />
            </FormItem>
            <FormItem>
              <Input {...register('housing_description')} label="OPIS STAMBENOG PITANJA:" disabled={isDisabled} />
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
                name="contract.organization_unit_id"
                control={control}
                render={({field: {onChange, name, value}}) => (
                  <Dropdown
                    name={name}
                    onChange={onChange}
                    label="ORGANIZACIONA JEDINICA:"
                    isDisabled={isDisabled}
                    value={value as any}
                    options={organizationUnits}
                    error={errors.contract?.organization_unit_id?.message}
                  />
                )}
              />
            </FormItem>
            <FormItem>
              <Controller
                name="contract.department_id"
                control={control}
                render={({field: {onChange, name, value}}) => (
                  <Dropdown
                    name={name}
                    label="ODJELJENJE:"
                    value={value as any}
                    onChange={onChange}
                    noOptionsText="Prazno"
                    options={departmentOptions}
                    isDisabled={isDisabled || !contract?.organization_unit_id || is_judge}
                    error={errors.contract?.department_id?.message}
                  />
                )}
              />
            </FormItem>
            <FormItem>
              <Controller
                name="contract.job_position_in_organization_unit_id"
                control={control}
                render={({field: {onChange, name, value}}) => (
                  <Dropdown
                    name={name}
                    onChange={onChange}
                    label="RADNO MJESTO:"
                    value={value as any}
                    noOptionsText="Prazno"
                    options={positions}
                    isDisabled={isJobPositionInputDisabled}
                    error={errors.contract?.job_position_in_organization_unit_id?.message}
                  />
                )}
              />
            </FormItem>
            <div>
              <Controller
                name="is_judge"
                control={control}
                render={({field: {onChange, name, value}}) => (
                  <Switch
                    name={name}
                    checked={value}
                    onChange={onChange}
                    content={<Typography variant="bodyMedium" content="SUDIJA:" style={{marginLeft: 10}} />}
                    disabled={disabledJudge()}
                  />
                )}
              />
            </div>
            <div>
              <Controller
                name="is_president"
                control={control}
                render={({field: {onChange, name, value}}) => (
                  <Switch
                    name={name}
                    checked={value}
                    onChange={onChange}
                    content={<Typography variant="bodyMedium" content="PREDSJEDNIK SUDA:" style={{marginLeft: 10}} />}
                    disabled={disabledPresident()}
                  />
                )}
              />
            </div>
          </FormColumn>

          <FormColumn>
            <FormItem>
              <Controller
                name="contract.contract_type_id"
                control={control}
                render={({field: {onChange, name, value}}) => (
                  <Dropdown
                    name={name}
                    label="VRSTA ZAPOSLENJA:"
                    onChange={onChange}
                    value={value as any}
                    noOptionsText="Prazno"
                    options={contractTypes}
                    isDisabled={isDisabled}
                    error={errors.contract?.contract_type_id?.message}
                  />
                )}
              />
            </FormItem>
            <FormItem>
              <Controller
                name="contract.date_of_eligibility"
                control={control}
                render={({field: {onChange, name, value}}) => (
                  <Datepicker
                    name={name}
                    selected={value ? new Date(value) : ''}
                    onChange={onChange}
                    label="DATUM IZBORA:"
                    disabled={isDisabled}
                    error={errors.contract?.date_of_eligibility?.message}
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
                name="contract.date_of_start"
                control={control}
                render={({field: {onChange, name, value}}) => (
                  <Datepicker
                    name={name}
                    label="POČETAK RADNOG ODNOSA:"
                    selected={value ? new Date(value) : ''}
                    onChange={onChange}
                    disabled={isDisabled}
                    error={errors.contract?.date_of_start?.message}
                  />
                )}
              />
            </FormItem>

            <FormItem>
              <Controller
                name="contract.date_of_end"
                control={control}
                render={({field: {onChange, name, value}}) => (
                  <Datepicker
                    name={name}
                    label="KRAJ RADNOG ODNOSA:"
                    selected={value ? new Date(value) : ''}
                    onChange={onChange}
                    disabled={isDisabled}
                    error={errors.contract?.date_of_end?.message}
                  />
                )}
              />
            </FormItem>
            <FormItem>
              <Button
                size="lg"
                content={<Typography variant="bodyMedium" content="Prekid radnog odnosa" />}
                disabled={!contract}
              />
            </FormItem>
          </FormColumn>
        </FormRow>
      </FormWrapper>

      {isNew && (
        <FormWrapper>
          <TextWrapper>
            <Typography content="KORISNIČKI NALOG" variant="bodyMedium" />
          </TextWrapper>
          <FormRow style={{paddingBottom: 0}}>
            <FormColumn style={{flexBasis: 'calc(50% + 23px)'}}>
              <FormItem>
                {/* TODO value prop needs to be number also */}
                <Input {...register('id')} label="SISTEMSKI ID:" disabled={true} />
              </FormItem>
            </FormColumn>
          </FormRow>
          <FormRow style={{padding: 0}}>
            <FormColumn>
              <FormItem>
                <Input
                  {...register('email')}
                  label="E-MAIL:"
                  disabled={isDisabled}
                  error={errors.email && errors.email?.message}
                />
              </FormItem>
              <FormItem>
                <Input
                  {...register('password')}
                  label="LOZINKA:"
                  type="password"
                  placeholder="******"
                  disabled={isDisabled}
                  error={errors?.password?.message}
                />
              </FormItem>
              <FormItem>
                <Input
                  {...register('phone')}
                  label="BROJ TELEFONA:"
                  disabled={isDisabled}
                  error={errors?.phone?.message}
                />
              </FormItem>
            </FormColumn>
            <FormColumn>
              <FormItem>
                <Input
                  {...register('secondary_email')}
                  label="PRIVATNI E-MAIL:"
                  disabled={isDisabled}
                  error={errors.secondary_email?.message}
                />
              </FormItem>
              <FormItem>
                <Controller
                  name="pin"
                  control={control}
                  render={({field: {value, name, onChange}}) => (
                    <Input
                      onChange={onChange}
                      value={value}
                      name={name}
                      maxLength={4}
                      label="PIN:"
                      disabled={isDisabled}
                      error={errors?.pin?.message}
                    />
                  )}></Controller>
              </FormItem>
            </FormColumn>
          </FormRow>
        </FormWrapper>
      )}

      <FormFooter>
        <Controls>
          {isDisabled ? (
            <Button content="Uredi" variant="secondary" onClick={() => setIsDisabled(false)} />
          ) : !isNew ? (
            <>
              <Button
                content="Sačuvaj i zatvori"
                variant="secondary"
                onClick={() => handleSubmit((data: any) => handleSave(data, true))()}
                isLoading={isCreating}
              />
              <Button
                content="Sačuvaj i nastavi"
                variant="primary"
                onClick={() => handleSubmit((data: any) => handleSave(data, false))()}
                isLoading={isCreating}
              />
            </>
          ) : (
            <Button
              content="Sačuvaj"
              variant="primary"
              onClick={() => {
                handleSubmit((data: any) => handleSave(data, false))();
              }}
              isLoading={isUpdating}
            />
          )}
        </Controls>
      </FormFooter>
    </FormContainer>
  );
};
