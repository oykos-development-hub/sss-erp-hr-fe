import {Button, Datepicker, Dropdown, Input} from 'client-library';
import React, {useEffect, useMemo, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {educationTypes} from '../../../components/education/modals/constants';
import {yesOrNoOptionsBoolean, yesOrNoOptionsString} from '../../../constants';
import useBasicInfoGet from '../../../services/graphql/userProfile/basicInfo/useGetBasicInfo';
import useGetEducation from '../../../services/graphql/userProfile/education/useGetEducation';
import useInsertSalaryParams from '../../../services/graphql/userProfile/salaryParams/useInsertSalaryParams';
import useGetSalaryParams from '../../../services/graphql/userProfile/salaryParams/useSalaryParamsOverview';
import {ProfileSalaryFormValues} from '../../../types/graphql/salaryParams';
import {parseToDate} from '../../../utils/dateUtils';
import {insuranceBasis, salaryRanks} from './constants';
import {Controls, FormColumn, FormContainer, FormFooter, FormItem, FormRow, FormWrapper} from './styles';
import {SalaryParamsPageProps} from './types';
import {formatData, initialValues} from './utils';

export const SalaryParams: React.FC<SalaryParamsPageProps> = ({context}) => {
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const userProfileID = Number(context.navigation.location.pathname.split('/')[4]);
  const {salaryParams, refetch} = useGetSalaryParams(userProfileID);
  const {userBasicInfo} = useBasicInfoGet(userProfileID, {skip: !userProfileID});
  const {educationData} = useGetEducation(userProfileID, educationTypes.education_academic_types);

  const item = useMemo(() => {
    if (salaryParams) {
      return {
        ...salaryParams,
        benefited_track: salaryParams.benefited_track ? {id: 'Da', title: 'Da'} : {id: 'Ne', title: 'Ne'},
        without_raise: salaryParams.without_raise ? {id: true, title: 'Da'} : {id: false, title: 'Ne'},
        insurance_basis: {id: salaryParams.insurance_basis, title: salaryParams.insurance_basis},
        obligation_reduction: {id: salaryParams.obligation_reduction, title: salaryParams.obligation_reduction},
        weekly_work_hours: {id: salaryParams.weekly_work_hours, title: salaryParams.weekly_work_hours},
        salary_rank: {id: salaryParams.salary_rank, title: salaryParams.salary_rank},
        created_at: parseToDate(salaryParams.created_at),
      };
    }

    return null;
  }, [salaryParams]);

  const {insertSalaryParams} = useInsertSalaryParams();

  const {
    register,
    handleSubmit,
    formState: {isValid},
    reset,
    control,
    setValue,
    watch,
  } = useForm({
    defaultValues: initialValues,
  });

  useEffect(() => {
    refetch();
  }, [context.navigation.location]);

  useEffect(() => {
    if (item) {
      reset({...watch(), ...item});
    }
  }, [item]);

  useEffect(() => {
    if (userBasicInfo) {
      setValue('organization_unit', userBasicInfo.contract.organization_unit);
      setValue('job_position', userBasicInfo.contract.job_position_in_organization_unit);
      setValue('date_of_start', parseToDate(userBasicInfo.contract.date_of_start));
      setValue('contract_type', userBasicInfo.contract.contract_type);
    }
  }, [userBasicInfo]);

  useEffect(() => {
    if (educationData && educationData.length) setValue('education_level', (educationData[0] as any).academic_title);
  }, [educationData]);

  const handleSave = (values: ProfileSalaryFormValues, close: boolean) => {
    const payload = formatData({...values, user_profile_id: userProfileID});

    if (isValid) {
      insertSalaryParams(
        payload,
        () => {
          refetch();
          setIsDisabled(true);
          context.alert.success('Uspješno sačuvano.');

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
  };

  return (
    <FormContainer>
      <FormWrapper style={{marginTop: '20px'}}>
        <FormRow>
          <FormColumn>
            <FormItem>
              <Controller
                name="job_position"
                control={control}
                render={({field: {name, value}}) => (
                  <Dropdown name={name} label="RADNO MJESTO:" isDisabled value={value} options={[]} />
                )}
              />
            </FormItem>
            <FormItem>
              <Controller
                name="organization_unit"
                control={control}
                render={({field: {name, value}}) => (
                  <Dropdown name={name} label="ORGANIZACIONA JEDINICA:" isDisabled value={value} options={[]} />
                )}
              />
            </FormItem>
            <FormItem>
              <Controller
                name="benefited_track"
                control={control}
                render={({field: {onChange, name, value}}) => (
                  <Dropdown
                    name={name}
                    onChange={onChange}
                    label="BENEFI. STAŽ:"
                    isDisabled={isDisabled}
                    value={value}
                    options={yesOrNoOptionsString}
                  />
                )}
              />
            </FormItem>
            <FormItem>
              <Controller
                name="without_raise"
                control={control}
                render={({field: {onChange, name, value}}) => (
                  <Dropdown
                    name={name}
                    onChange={onChange}
                    label="BEZ POVEĆANJA:"
                    isDisabled={isDisabled}
                    value={value}
                    options={yesOrNoOptionsBoolean}
                  />
                )}
              />
            </FormItem>
            <FormItem>
              <Controller
                name="insurance_basis"
                control={control}
                render={({field: {onChange, name, value}}) => (
                  <Dropdown
                    name={name}
                    onChange={onChange}
                    label="OSNOVA OSIG. PO PIO:"
                    isDisabled={isDisabled}
                    value={value}
                    options={insuranceBasis}
                  />
                )}
              />
            </FormItem>
            <FormItem>
              <Controller
                name="salary_rank"
                control={control}
                render={({field: {onChange, name, value}}) => (
                  <Dropdown
                    name={name}
                    onChange={onChange}
                    label="TARIFNI PLATNI RAZRED:"
                    isDisabled={isDisabled}
                    value={value}
                    options={salaryRanks}
                  />
                )}
              />
            </FormItem>
            <FormItem>
              <Controller
                name="contract_type"
                control={control}
                render={({field: {name, value}}) => (
                  <Dropdown name={name} label="VRSTA UGOVORA:" isDisabled value={value} options={[]} />
                )}
              />
            </FormItem>
            <FormItem>
              <Controller
                name="date_of_start"
                control={control}
                render={({field: {name, value, onChange}}) => (
                  <Datepicker
                    onChange={onChange}
                    name={name}
                    selected={value}
                    label="POČETAK RADNOG ODNOSA:"
                    disabled
                  />
                )}
              />
            </FormItem>
          </FormColumn>

          <FormColumn>
            <FormItem>
              <Controller
                name="weekly_work_hours"
                control={control}
                render={({field: {onChange, name, value}}) => (
                  <Dropdown
                    name={name}
                    onChange={onChange}
                    label="RADNO VRIJEME:"
                    isDisabled={isDisabled}
                    value={value}
                    options={[
                      {id: '10', title: '10'},
                      {id: '20', title: '20'},
                      {id: '40', title: '40'},
                    ]}
                  />
                )}
              />
            </FormItem>
            <FormItem>
              <Controller
                name="obligation_reduction"
                control={control}
                render={({field: {onChange, name, value}}) => (
                  <Dropdown
                    label="UMANJENJE RADNE OBAVEZE:"
                    isDisabled={isDisabled}
                    name={name}
                    onChange={onChange}
                    value={value}
                    options={[
                      {id: '25%', title: '25%'},
                      {id: '50%', title: '50%'},
                      {id: '75%', title: '75%'},
                    ]}
                  />
                )}
              />
            </FormItem>
          </FormColumn>

          <FormColumn>
            <FormItem>
              <Input {...register('education_level')} label="STEPEN STRUČNOG OBRAZOVANJA:" disabled />
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
                content="Otkaži"
                variant="secondary"
                onClick={() => {
                  setIsDisabled(true);
                }}
              />
              <Button
                content="Sačuvaj"
                variant="primary"
                onClick={() => handleSubmit((data: ProfileSalaryFormValues) => handleSave(data, false))()}
              />
            </>
          )}
        </Controls>
      </FormFooter>
    </FormContainer>
  );
};
