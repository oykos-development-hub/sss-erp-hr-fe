import {Button, Datepicker, Dropdown, Input} from 'client-library';
import React, {useEffect, useMemo, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {yesOrNoOptionsBoolean, yesOrNoOptionsString} from '../../../constants';
import useSalaryParamsOverview from '../../../services/graphql/userProfile/salaryParams/useSalaryParamsOverview';
import useSalaryParamsInsert from '../../../services/graphql/userProfile/salaryParams/useSalaryParamsinsert';
import {UserProfileGetSalaryParams} from '../../../types/graphql/userProfileGetSalaryParams';
import {insuranceBasis, salaryRanks} from './constants';
import {Controls, FormColumn, FormContainer, FormFooter, FormItem, FormRow, FormWrapper} from './styles';
import {SalaryParamsPageProps} from './types';
import {formatData, initialValues} from './utils';
import {parseToDate} from '../../../utils/dateUtils';
import useBasicInfoGet from '../../../services/graphql/userProfile/basicInfo/useBasicInfoGet';
import useEducationOverview from '../../../services/graphql/userProfile/education/useEducationOverview';
import { educationTypes } from '../../../components/education/modals/constants';

export const SalaryParams: React.FC<SalaryParamsPageProps> = ({context}) => {
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const userProfileID = Number(context.navigation.location.pathname.split('/')[4]);
  const {data, refetch} = useSalaryParamsOverview(userProfileID);

  const {data: profileData} = useBasicInfoGet(Number(context.navigation.location.pathname.split('/')[4]));
  const {employeeEducationData: educationData} = useEducationOverview(Number(context.navigation.location.pathname.split('/')[4]), educationTypes.education_academic_types) as any;

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
        created_at: parseToDate(data[0].created_at),
        user_resolution_id: data[0].user_resolution_id ?? {
          id: data[0].user_resolution_id,
          title: data[0].user_resolution_id,
        },
      };
    }

    return null;
  }, [data]);

  const {mutate} = useSalaryParamsInsert();

  const {
    register,
    handleSubmit,
    formState: {isValid},
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

  return (
    <FormContainer>
      <FormWrapper style={{marginTop: '20px'}}>
        <FormRow>
          <FormColumn>
            <FormItem>
              <Controller
                name="job_position_in_organization_unit_id"
                control={control}
                render={({field: {name}}) => (
                  <Dropdown
                    name={name}
                    label="RADNO MJESTO:"
                    isDisabled
                    value={profileData?.job_position}
                    options={profileData?.job_position ? new Array(profileData.job_position) : []}
                  />
                )}
              />
            </FormItem>
            <FormItem>
              <Controller
                name="organization_unit"
                control={control}
                render={({field: {name}}) => (
                  <Dropdown
                    name={name}
                    label="ORGANIZACIONA JEDINICA:"
                    isDisabled
                    value={profileData?.contract.organization_unit}
                    options={profileData?.contract.organization_unit ? new Array(profileData?.contract.organization_unit) : []}
                  />
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
                    value={value as any}
                    options={yesOrNoOptionsBoolean as any}
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
                name="user_resolution_id"
                control={control}
                render={({field: {name}}) => (
                  <Dropdown
                    name={name}
                    label="VRSTA UGOVORA:"
                    isDisabled
                    value={profileData?.contract.contract_type}
                    options={profileData?.contract?.contract_type ? new Array(profileData.contract.contract_type) : []}
                  />
                )}
              />
            </FormItem>
            <FormItem>
              <Controller
                name=""
                control={control}
                render={({field: {name}}) => (
                  <Datepicker
                    onChange={() => {}}
                    name={name}
                    selected={parseToDate(profileData?.contract?.date_of_start || null)}
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
                name="daily_work_hours"
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
                  />
                )}
              />
            </FormItem>
            <FormItem>
              <Controller
                name="weekly_work_hours"
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
                  />
                )}
              />
            </FormItem>
          </FormColumn>

          <FormColumn>
            <FormItem>
              <Input
                value={educationData?.[0]?.academic_title ? educationData[0].academic_title : ''}
                label="STEPEN STRUČNOG OBRAZOVANJA:"
                disabled={isDisabled}
              />
            </FormItem>
          </FormColumn>
          <FormColumn>
            <FormItem>
              <FormItem>
                <Input
                  {...register('education_naming')}
                  label="ZANIMANJE PO STRUCI:"
                  disabled={isDisabled}
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
