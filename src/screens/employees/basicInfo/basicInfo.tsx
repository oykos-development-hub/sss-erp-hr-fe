import {yupResolver} from '@hookform/resolvers/yup';
import {Switch} from '@oykos-development/devkit-react-ts-styled-components';
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
import useAppContext from '../../../context/useAppContext';
import useGetAvailableJobPositions from '../../../services/graphql/jobPositions/useGetAvailableJobPositions';
import useGetAvailableJudges from '../../../services/graphql/judges/useGetJudgeAvailability';
import useGetOrganizationUnits from '../../../services/graphql/organizationUnits/useGetOrganizationUnits';
import useSettingsDropdownOverview from '../../../services/graphql/settingsDropdown/useSettingsDropdownOverview';
import useGetBasicInfo from '../../../services/graphql/userProfile/basicInfo/useGetBasicInfo';
import useInsertBasicInfo from '../../../services/graphql/userProfile/basicInfo/useInsertBasicInfo';
import useUpdateBasicInfo from '../../../services/graphql/userProfile/basicInfo/useUpdateBasicInfo';
import {DropdownDataString} from '../../../types/dropdownData';
import {parseToDate} from '../../../utils/dateUtils';
import {backendErrors, contractPositions, initialValues} from './constants';
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
import useInsertJobTenderApplication from '../../../services/graphql/jobTenderApplications/useInsertJobTenderApplication';
import {basicInfoSchema, booleanToYesOrNo, formatData} from './utils';
import {ContractEndModal} from '../../../components/contractEndModal/contractEndModal';
import {ProfileBasicInfoFormValues} from '../../../types/graphql/userProfileBasicInfo';

export const BasicInfo: React.FC = () => {
  const context = useAppContext();
  const profileId = Number(context?.navigation.location.pathname.split('/')[4]);
  const {userBasicInfo, refetch} = useGetBasicInfo(profileId, {skip: !profileId});

  const [creatingChosenJobApplicant, setCreatingChosenJobApplicant] = useState<boolean>(false);
  const isNew = !profileId;
  // const isJudge = userBasicInfo?.is_judge;
  const isPresident = userBasicInfo?.is_president;
  const [isDisabled, setIsDisabled] = useState<boolean>(!isNew);
  const [openContractEndModal, setOpenCotractEndModal] = useState<boolean>(false);

  const {organizationUnits, departments} = useGetOrganizationUnits(undefined);
  const {options: contractTypes} = useSettingsDropdownOverview({entity: 'contract_types'});
  const {insertBasicInfo, loading: isCreating} = useInsertBasicInfo();
  const {updateBasicInfo, loading: isUpdating} = useUpdateBasicInfo();
  const {insertJobTenderApplication, loading: isUpdatingApplication} = useInsertJobTenderApplication();

  const {
    register,
    handleSubmit,
    formState: {errors, isValid, dirtyFields},
    reset,
    control,
    setError,
    watch,
    setValue,
    clearErrors,
  } = useForm({
    resolver: yupResolver(basicInfoSchema),
    defaultValues: {
      is_judge: false,
      is_president: false,
    },
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

  const {organization_unit_id, department_id, contract_type_id, is_judge, is_president} = watch();

  const maritalOptions = gender === 'M' ? maleMaritalStatusOptions : femaleMaritalStatusOptions;

  const {judgeAvailablity, refetch: refetchJudgeAvailablity} = useGetAvailableJudges();

  const {availableJobPositions} = useGetAvailableJobPositions(organization_unit_id?.id, department_id?.id);

  const departmentOptions = useMemo(() => {
    if (!organization_unit_id) return [];

    if (organization_unit_id && departments && departments.length) {
      return departments.filter((dep: any) => dep.parent_id === organization_unit_id?.id);
    } else {
      return departments;
    }
  }, [organization_unit_id, organizationUnits]);

  const onFileUpload = (acceptedFiles: FileList) => {
    console.log('File(s) uploaded:', acceptedFiles);
  };

  const handleSave = async (values: ProfileBasicInfoFormValues, close: boolean) => {
    if (isValid) {
      if (!userBasicInfo?.id) {
        if (isCreating) return;

        await insertBasicInfo(
          formatData(values),
          userId => {
            if (creatingChosenJobApplicant) {
              updateJobTenderApplication();
            }

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
            const emailErr = res.message === 'user_email_exists';
            const jmbgErr = res.message === 'user_jmbg_exists';

            if (emailErr) {
              setError('email', {
                type: 'custom',
                message: backendErrors[res.message],
              });
            }
            if (jmbgErr) {
              setError('official_personal_id', {
                type: 'custom',
                message: backendErrors[res.message],
              });
            }

            context.alert.error(
              `Greška. Promjene nisu sačuvane. ${emailErr ? 'Postojeći Email ' : ''} ${
                jmbgErr ? 'Postojeći JMBG ' : ''
              }`,
            );
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

  const updateJobTenderApplication = async () => {
    await insertJobTenderApplication(context.navigation.location.state.application, () => {
      context.alert.success('Uspješno izabran kandidat.');
      context.navigation.navigate('/hr/job-tenders-list');
      context.navigation.location.state = {};
    });
  };

  useEffect(() => {
    refetch();
    // If new employee, enable the form immediately
    if (context.navigation.location.pathname.split('/')[3] === 'new-employee') {
      setIsDisabled(false);
    }
  }, [context.navigation.location]);

  useEffect(() => {
    if (userBasicInfo) {
      reset({
        ...userBasicInfo,
        nationality: countryOptions.find((opt: DropdownDataString) => opt.id === userBasicInfo.nationality),
        citizenship: countryOptions.find((opt: DropdownDataString) => opt.id === userBasicInfo.citizenship),
        date_of_birth: parseToDate(userBasicInfo?.date_of_birth),
        date_of_becoming_judge: parseToDate(userBasicInfo?.date_of_becoming_judge),
        marital_status: maritalOptions.find(opt => opt.id === userBasicInfo?.marital_status),
        country_of_birth: countryOptions.find((opt: DropdownDataString) => opt.id === userBasicInfo?.country_of_birth),
        city_of_birth: userBasicInfo?.city_of_birth,
        housing_done: booleanToYesOrNo(userBasicInfo?.housing_done),
        single_parent: booleanToYesOrNo(userBasicInfo?.single_parent),
        gender: genderOptions.find((opt: DropdownDataString) => opt.id === userBasicInfo?.gender),
        is_president: userBasicInfo?.is_president,
        national_minority: nationalMinorities.find(
          (opt: DropdownDataString) => opt.id === userBasicInfo?.national_minority,
        ),
        official_personal_document_issuer: cityData.find(
          (opt: DropdownDataString) => opt.id === userBasicInfo?.official_personal_document_issuer,
        ),
        personal_id: userBasicInfo?.personal_id ?? '',
        organization_unit_id: userBasicInfo?.contract?.organization_unit ?? undefined,
        department_id: userBasicInfo?.contract?.department ?? undefined,
        job_position_in_organization_unit_id: userBasicInfo?.contract?.job_position_in_organization_unit ?? undefined,
        contract_type_id: userBasicInfo?.contract?.contract_type ?? undefined,
        date_of_end: parseToDate(userBasicInfo?.contract?.date_of_end),
        date_of_start: parseToDate(userBasicInfo?.contract?.date_of_start),
        date_of_eligibility: parseToDate(userBasicInfo?.contract?.date_of_eligibility),
        user_profile_id: userBasicInfo?.id,
        active: userBasicInfo?.contract?.active,
        number_of_conference: userBasicInfo?.contract.number_of_conference,
      });
    }
  }, [userBasicInfo]);

  // When coming from the job tender applications, when changing an external candidates status to accepted, it leads here to create it in the system, basically becoming an internal candidate in order to be accepted
  useEffect(() => {
    if (!context.navigation.location.state || !organizationUnits) return;

    const {user} = context.navigation.location.state;
    setCreatingChosenJobApplicant(true);

    reset({
      ...initialValues,
      ...user,
      organization_unit_id: organizationUnits.find((opt: any) => opt.id === user?.organization_unit_id),
    });
  }, [context.navigation.location.state, organizationUnits]);

  useEffect(() => {
    if (organization_unit_id) {
      if (
        organization_unit_id &&
        organization_unit_id?.id &&
        organization_unit_id.title?.indexOf('Sudski savjet') == -1
      ) {
        refetchJudgeAvailablity(organization_unit_id?.id);
      }

      if (dirtyFields.organization_unit_id) {
        setValue('department_id', null);
      }
    }
  }, [organization_unit_id]);

  useEffect(() => {
    if (dirtyFields.is_president) {
      is_president ? setValue('is_judge', true) : setValue('is_judge', false);
    }
  }, [is_president]);

  const isJudgeSwitchDisabled = (): boolean => {
    if (creatingChosenJobApplicant) return true;
    if (organization_unit_id?.title && organization_unit_id.title?.indexOf('Sudski savjet') > -1) return true;
    if (is_judge) return false;
    if (judgeAvailablity?.judge) return false;
    return true;
  };

  const isPresidentSwitchDisabled = (): boolean => {
    if (creatingChosenJobApplicant) return true;
    if (organization_unit_id?.title && organization_unit_id.title?.indexOf('Sudski savjet') > -1) return true;
    if (isPresident) return false;
    if (judgeAvailablity?.president) return false;

    return true;
  };

  useEffect(() => {
    if (is_judge || is_president) {
      clearErrors('department_id');
      setValue('department_id', null);
      setValue('job_position_in_organization_unit_id', null);
    }
  }, [is_judge, is_president]);

  const isJobPositionInputDisabled =
    isDisabled ||
    !organization_unit_id ||
    !department_id ||
    !(contract_type_id?.title && contractPositions.indexOf(contract_type_id?.title) > -1) ||
    is_judge;

  const toggleContractEndModal = () => {
    setOpenCotractEndModal(!openContractEndModal);
  };

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
                name="organization_unit_id"
                control={control}
                render={({field: {onChange, name, value}}) => (
                  <Dropdown
                    name={name}
                    onChange={onChange}
                    label="ORGANIZACIONA JEDINICA:"
                    isDisabled={isDisabled || creatingChosenJobApplicant}
                    value={value as any}
                    options={organizationUnits}
                    error={errors.organization_unit_id?.message}
                  />
                )}
              />
            </FormItem>
            <FormItem>
              <Controller
                name="department_id"
                control={control}
                render={({field: {onChange, name, value}}) => (
                  <Dropdown
                    name={name}
                    label="ODJELJENJE:"
                    value={value as any}
                    onChange={onChange}
                    noOptionsText="Prazno"
                    options={departmentOptions}
                    isDisabled={isDisabled || !organization_unit_id || is_judge || creatingChosenJobApplicant}
                    error={errors.department_id?.message}
                  />
                )}
              />
            </FormItem>
            <FormItem>
              <Controller
                name="job_position_in_organization_unit_id"
                control={control}
                render={({field: {onChange, name, value}}) => (
                  <Dropdown
                    name={name}
                    onChange={onChange}
                    label="RADNO MJESTO:"
                    value={value as any}
                    noOptionsText="Prazno"
                    options={availableJobPositions}
                    isDisabled={isJobPositionInputDisabled || creatingChosenJobApplicant}
                    error={errors.job_position_in_organization_unit_id?.message}
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
                    disabled={isDisabled || isJudgeSwitchDisabled()}
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
                    disabled={isDisabled || isPresidentSwitchDisabled()}
                  />
                )}
              />
            </div>
          </FormColumn>

          <FormColumn>
            <FormItem>
              <Controller
                name="contract_type_id"
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
                    error={errors.contract_type_id?.message}
                  />
                )}
              />
            </FormItem>
            <FormItem>
              <Controller
                name="date_of_eligibility"
                control={control}
                render={({field: {onChange, name, value}}) => (
                  <Datepicker
                    name={name}
                    selected={value ? new Date(value) : ''}
                    onChange={onChange}
                    label="DATUM IZBORA:"
                    disabled={isDisabled}
                    error={errors.date_of_eligibility?.message}
                  />
                )}
              />
            </FormItem>
            <FormItem>
              <Input {...register('number_of_conference')} label="BROJ SJEDNICE:" disabled={isDisabled} />
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
                control={control}
                render={({field: {onChange, name, value}}) => (
                  <Datepicker
                    name={name}
                    label="POČETAK RADNOG ODNOSA:"
                    selected={value ? new Date(value) : ''}
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
                control={control}
                render={({field: {onChange, name, value}}) => (
                  <Datepicker
                    name={name}
                    label="KRAJ RADNOG ODNOSA:"
                    selected={value ? new Date(value) : ''}
                    onChange={onChange}
                    disabled={isDisabled}
                    error={errors.date_of_end?.message}
                  />
                )}
              />
            </FormItem>
            <FormItem>
              <Button
                size="xl"
                content={<Typography variant="bodyMedium" content="Prekid radnog odnosa" />}
                disabled={isDisabled}
                onClick={() => setOpenCotractEndModal(true)}
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
                isLoading={isUpdating || isUpdatingApplication}
              />
              <Button
                content="Sačuvaj i nastavi"
                variant="primary"
                onClick={() => handleSubmit((data: any) => handleSave(data, false))()}
                isLoading={isUpdating || isUpdatingApplication}
              />
            </>
          ) : (
            <Button
              content="Sačuvaj"
              variant="primary"
              onClick={() => {
                handleSubmit((data: any) => handleSave(data, false))();
              }}
              isLoading={isCreating}
            />
          )}
        </Controls>
      </FormFooter>
      {openContractEndModal && (
        <ContractEndModal
          open={true}
          onClose={() => toggleContractEndModal()}
          profileId={profileId}
          context={context}
        />
      )}
    </FormContainer>
  );
};
