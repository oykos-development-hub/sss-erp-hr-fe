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
  const userProfileID = Number(context.navigation.location.pathname.split('/')[4]);
  const {data, refetch} = useSalaryParamsOverview(userProfileID);

  const item = useMemo(() => {
    if (data && data.length) {
      return {
        ...data[0],
        benefited_track: data[0].benefited_track ? {id: 'Da', title: 'Da'} : {id: 'Ne', title: 'Ne'},
        without_raise: data[0].without_raise ? {id: 'Da', title: 'Da'} : {id: 'Ne', title: 'Ne'},
        insurance_basis: {id: data[0].insurance_basis, title: data[0].insurance_basis},
        daily_work_hours: {id: data[0].daily_work_hours, title: data[0].daily_work_hours},
        weekly_work_hours: {id: data[0].weekly_work_hours, title: data[0].weekly_work_hours},
        salary_rank: {id: data[0].salary_rank, title: data[0].salary_rank},
        user_resolution_id: data[0].user_resolution_id ?? {
          id: data[0].user_resolution_id,
          title: data[0].user_resolution_id,
        },
      };
    }

    return null;
  }, [data]);

  const {data: jobPositions} = useJobPositions('');
  const {organizationUnits} = useOrganizationUnits(context);

  const {mutate} = useSalaryParamsInsert();

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

    if (!item) {
      delete payload.id;
    }

    if (isValid) {
      mutate(
        payload,
        () => {
          refetch();
          setIsDisabled(true);
          context.alert.success('Uspješno sačuvano.');
        },
        () => {
          context.alert.error('Greška. Promjene nisu sačuvane.');
        },
      );
    }
  };

  const jobPositionOptions = useMemo(() => {
    return jobPositions.items.map((jobPosition: any) => ({id: jobPosition.id, title: jobPosition.title}));
  }, [jobPositions]);

  const organizationUnitsList = useMemo(() => {
    return organizationUnits
      .filter(i => !i.parent_id)
      .map(unit => {
        return {id: unit.id, title: unit.title};
      });
  }, [organizationUnits]);

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
            {/* <FormItem>
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
            </FormItem> */}
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
                    selected={value ? new Date(value) : ''}
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
