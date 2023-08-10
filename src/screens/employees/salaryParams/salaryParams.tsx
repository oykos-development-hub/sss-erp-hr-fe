import React, {useEffect, useMemo, useState} from 'react';
import {FormContainer, FormColumn, FormFooter, FormWrapper, FormRow, FormItem, Controls} from './styles';
import {Input, Dropdown, Button, Datepicker} from 'client-library';
import useOrganizationUnits from '../../../services/graphql/organizationUnits/useOrganizationUnits';
import {SalaryParamsPageProps} from './types';
import {Controller, useForm} from 'react-hook-form';
import {insuranceBasis, salaryRanks} from './constants';
import {parseDate} from '../../../utils/dateUtils';
import useJobPositions from '../../../services/graphql/jobPositions/useJobPositionOverview';
import {contractTypes, yesOrNoOptionsBoolean, yesOrNoOptionsString} from '../../../constants';
import {UserProfileGetSalaryParams} from '../../../types/graphql/userProfileGetSalaryParams';
import {formatData, initialValues} from './utils';
import useSalaryParamsOverview from '../../../services/graphql/userProfile/salaryParams/useSalaryParamsOverview';
import useSalaryParamsInsert from '../../../services/graphql/userProfile/salaryParams/useSalaryParamsinsert';

export const SalaryParams: React.FC<SalaryParamsPageProps> = ({context}) => {
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const userProfileID = context.navigation.location.pathname.split('/')[3];
  const {data, refetch} = useSalaryParamsOverview(userProfileID);

  const item = useMemo(() => {
    return (
      data && {
        ...data,
        benefited_track: data?.benefited_track ? {id: 'Da', title: 'Da'} : {id: 'Ne', title: 'Ne'},
        without_raise: data?.without_raise ? {id: 'Da', title: 'Da'} : {id: 'Ne', title: 'Ne'},
        insurance_basis: {id: data?.insurance_basis, title: data?.insurance_basis},
        daily_work_hours: {id: data?.daily_work_hours, title: data?.daily_work_hours},
        weekly_work_hours: {id: data?.weekly_work_hours, title: data?.weekly_work_hours},
        salary_rank: {id: data?.salary_rank, title: data?.salary_rank},
        user_resolution_id: data?.user_resolution_id ?? {id: data?.user_resolution_id, title: data?.user_resolution_id},
      }
    );
  }, [data]);

  const {data: jobPositions} = useJobPositions('');
  const {organizationUnitsList} = useOrganizationUnits(context);

  const {mutate} = useSalaryParamsInsert(
    () => {
      refetch();
      setIsDisabled(true);
      context.alert.success('Dodavanje podataka uspješno');
    },
    () => {
      context.alert.error('Greška prilikom čuvanja podataka');
    },
  );

  const {
    register,
    handleSubmit,
    formState: {errors, isValid},
    reset,
    control,
  } = useForm({
    defaultValues: item || initialValues,
  });

  useEffect(() => {
    refetch();
  }, [context.navigation.location]);

  useEffect(() => {
    reset(item);
  }, [item]);

  const handleSave = (values: UserProfileGetSalaryParams) => {
    const payload = formatData({...values, user_profile_id: userProfileID});
    if (isValid) {
      mutate(payload);
    }
  };

  const jobPositionOptions = useMemo(() => {
    return jobPositions.items.map((jobPosition: any) => ({id: jobPosition.id, title: jobPosition.title}));
  }, [jobPositions]);

  return (
    <FormContainer>
      <FormWrapper style={{marginTop: '20px'}}>
        <FormRow>
          <FormColumn>
            <FormItem>
              <Controller
                name="job_position_id"
                rules={{required: 'Ovo polje je obavezno'}}
                control={control}
                render={({field: {onChange, name, value}}) => (
                  <Dropdown
                    name={name}
                    onChange={onChange}
                    label="STATUS ZAPOSLENOG:"
                    value={value as any}
                    noOptionsText="Prazno"
                    options={jobPositionOptions}
                    isDisabled={isDisabled}
                    error={errors.job_position_id?.message as string}
                  />
                )}
              />
            </FormItem>
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
                    error={errors.organization_unit_id?.message as string}
                  />
                )}
              />
            </FormItem>
            <FormItem>
              <Controller
                name="benefited_track"
                rules={{required: 'Ovo polje je obavezno'}}
                control={control}
                render={({field: {onChange, name, value}}) => (
                  <Dropdown
                    name={name}
                    onChange={onChange}
                    label="BENEFI. STAŽ:"
                    isDisabled={isDisabled}
                    value={value}
                    options={yesOrNoOptionsString}
                    error={errors.benefited_track?.message as string}
                  />
                )}
              />
            </FormItem>
            <FormItem>
              <Controller
                name="without_raise"
                rules={{required: 'Ovo polje je obavezno'}}
                control={control}
                render={({field: {onChange, name, value}}) => (
                  <Dropdown
                    name={name}
                    onChange={onChange}
                    label="BEZ POVEĆANJA:"
                    isDisabled={isDisabled}
                    value={value as any}
                    options={yesOrNoOptionsBoolean as any}
                    error={errors.without_raise?.message as string}
                  />
                )}
              />
            </FormItem>
            <FormItem>
              <Controller
                name="insurance_basis"
                rules={{required: 'Ovo polje je obavezno'}}
                control={control}
                render={({field: {onChange, name, value}}) => (
                  <Dropdown
                    name={name}
                    onChange={onChange}
                    label="OSNOVA OSIG. PO PIO:"
                    isDisabled={isDisabled}
                    value={value}
                    options={insuranceBasis}
                    error={errors.insurance_basis?.message as string}
                  />
                )}
              />
            </FormItem>
            <FormItem>
              <Controller
                name="zk"
                rules={{required: 'Ovo polje je obavezno'}}
                control={control}
                render={({field: {onChange, name, value}}) => (
                  <Dropdown
                    name={name}
                    onChange={onChange}
                    label="ZK:"
                    isDisabled={isDisabled}
                    value={value as any}
                    options={yesOrNoOptionsString}
                    error={errors.zk?.message as string}
                  />
                )}
              />
            </FormItem>
            <FormItem>
              <Controller
                name="salary_rank"
                rules={{required: 'Ovo polje je obavezno'}}
                control={control}
                render={({field: {onChange, name, value}}) => (
                  <Dropdown
                    name={name}
                    onChange={onChange}
                    label="TARIFNI PLATNI RAZRED:"
                    isDisabled={isDisabled}
                    value={value}
                    options={salaryRanks}
                    error={errors.salary_rank?.message as string}
                  />
                )}
              />
            </FormItem>
            <FormItem>
              <Controller
                name="user_resolution_id"
                rules={{required: 'Ovo polje je obavezno'}}
                control={control}
                render={({field: {onChange, name, value}}) => (
                  <Dropdown
                    name={name}
                    onChange={onChange}
                    label="RJEŠENJE:"
                    isDisabled={isDisabled}
                    value={value}
                    options={contractTypes}
                    error={errors.user_resolution_id?.message as string}
                  />
                )}
              />
            </FormItem>
            <FormItem>
              <Controller
                name="created_at"
                rules={{required: 'Ovo polje je obavezno'}}
                control={control}
                render={({field: {name, onChange, value}}) => (
                  <Datepicker
                    name={name}
                    value={value ? parseDate(value) : ''}
                    onChange={onChange}
                    label="DATUM RJEŠENJA:"
                    disabled={isDisabled}
                    error={errors.created_at?.message}
                  />
                )}
              />
            </FormItem>
          </FormColumn>

          <FormColumn>
            <FormItem>
              <Controller
                name="daily_work_hours"
                rules={{required: 'Ovo polje je obavezno'}}
                control={control}
                render={({field: {onChange, name, value}}) => (
                  <Dropdown
                    name={name}
                    onChange={onChange}
                    label="RADNO VRIJEME:"
                    isDisabled={isDisabled}
                    value={value as any}
                    options={[
                      {id: '8', title: '8'},
                      {id: '4', title: '4'},
                      {id: '2', title: '2'},
                    ]}
                    error={errors.daily_work_hours?.message as string}
                  />
                )}
              />
            </FormItem>
            <FormItem>
              <Controller
                name="weekly_work_hours"
                rules={{required: 'Ovo polje je obavezno'}}
                control={control}
                render={({field: {onChange, name, value}}) => (
                  <Dropdown
                    name={name}
                    onChange={onChange}
                    label="SEDMIČNA OBAVEZA:"
                    isDisabled={isDisabled}
                    value={value}
                    options={[
                      {id: '10', title: '10'},
                      {id: '20', title: '20'},
                      {id: '40', title: '40'},
                    ]}
                    error={errors.weekly_work_hours?.message as string}
                  />
                )}
              />
            </FormItem>
          </FormColumn>

          <FormColumn>
            <FormItem>
              <Input
                {...register('education_rank', {required: 'Ovo polje je obavezno'})}
                label="STEPEN STRUČNOG OBRAZOVANJA:"
                disabled={isDisabled}
                error={errors.education_rank?.message as string}
              />
            </FormItem>
          </FormColumn>
          <FormColumn>
            <FormItem>
              <FormItem>
                <Input
                  {...register('education_naming', {required: 'Ovo polje je obavezno'})}
                  label="ZANIMANJE PO STRUCI:"
                  disabled={isDisabled}
                  error={errors.education_naming?.message as string}
                />
              </FormItem>
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
                onClick={() => handleSubmit((data: UserProfileGetSalaryParams) => handleSave(data))()}
              />
              <Button
                content="Sačuvaj i nastavi"
                variant="primary"
                onClick={() => handleSubmit((data: UserProfileGetSalaryParams) => handleSave(data))()}
              />
            </>
          )}
        </Controls>
      </FormFooter>
    </FormContainer>
  );
};
