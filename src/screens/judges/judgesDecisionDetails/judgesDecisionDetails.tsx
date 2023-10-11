import {Button, Divider, Input, TableHead, Typography} from 'client-library';
import {nanoid} from 'nanoid';
import React, {useEffect, useMemo, useState} from 'react';
import {useForm} from 'react-hook-form';
import {OverviewBox} from '../../../components/employeesList/styles';
import useJudgeResolutionsInsert from '../../../services/graphql/judges/useJudgeResolutionInsert';
import useJudgeResolutionsOverview from '../../../services/graphql/judges/useJudgeResolutionOverview';
import useOrganizationUintCalculateEmployeeStats from '../../../services/graphql/judges/useOrganizationUintCalculateEmployeeStats';
import useGetOrganizationUnits from '../../../services/graphql/organizationUnits/useGetOrganizationUnits';
import {MainTitle} from '../../../shared/mainTitle';
import {ScreenWrapper} from '../../../shared/screenWrapper/screenWrapper';
import {JudgeResolutionItem, JudgeResolution} from '../../../types/graphql/judges';
import {judgeResolutionTableHeads} from '../judgeNorms/constants';
import {Controls, CustomTable, Filters, FormFooter} from './styles';
import useAppContext from '../../../context/useAppContext';

export interface JudgesNumbersDetailsListProps {
  isNew?: boolean;
}

const defaultValues = {
  available_slots_presidents: 1,
  available_slots_judges: 0,
  number_of_judges: 0,
  number_of_presidents: 0,
  number_of_employees: 0,
  number_of_relocated_judges: 0,
  number_of_suspended_judges: 0,
};

export const JudgesNumbersDetails: React.FC<JudgesNumbersDetailsListProps> = ({isNew}) => {
  const context = useAppContext();
  const [isDisabled, setIsDisabled] = useState<boolean>(isNew ? false : true);
  const {organizationUnits, loading: organizationUnitsLoading} = useGetOrganizationUnits();
  const id = context.navigation.location.pathname.split('/')[4];
  const {judgesData: realJudgeNumberData, loading: realJudgeDataLoading} = useOrganizationUintCalculateEmployeeStats({
    resolution_id: isNew ? null : +id,
    active: isNew ? true : false,
  });

  const {data, loading: judgeResolutionsLoading} = useJudgeResolutionsOverview({page: 1, size: 1000});

  const {mutate} = useJudgeResolutionsInsert();

  const isLoading = organizationUnitsLoading || realJudgeDataLoading || judgeResolutionsLoading;

  const resolutionItem = useMemo(() => data.find((resolution: JudgeResolution) => resolution.id === +id), [data, id]);

  useEffect(() => {
    // Setting the "isDisabled" state to true if the decision is not active. Inactive decisions cannot be edited.
    if (resolutionItem) {
      setIsDisabled(!resolutionItem?.active);
    }
  }, [resolutionItem]);

  const {
    register,
    handleSubmit,
    formState: {errors},
    reset,
    watch,
  } = useForm({mode: 'onBlur'});

  const resolutions = watch('resolutions');

  const handleSave = (values: any) => {
    setIsDisabled(true);

    const data = {
      id: values.id,
      serial_number: values.serial_number,
      year: values.year?.id ?? '',
      active: true,
      items: Object.keys(values.resolutions).map(key => ({
        organization_unit_id: +key,
        number_of_judges: +values.resolutions[key].available_slots_judges,
        number_of_presidents: 1,
        id: resolutionItem?.items.find((i: JudgeResolutionItem) => i.organization_unit.id === +key)?.id ?? 0,
      })),
    };

    mutate(
      data,
      () => {
        setIsDisabled(true);
        context.alert.success('Odluka uspješno sačuvana.');

        context.navigation.navigate('/hr/judges/number-decision');
        context.breadcrumbs.remove();
      },
      () => {
        context.alert.error('Greška. Promjene nisu sačuvane.');
      },
    );
  };

  const list = useMemo(() => {
    // Mapping through the organizationUnits and adding the corresponding data from the real, current, judge number data (if editing)
    let orgUnits: any[] = [];

    orgUnits = organizationUnits.filter(ou => ou.title.indexOf('Sudski savjet') === -1);

    return orgUnits.map((orgItem: any) => {
      const realJudgeStats = realJudgeNumberData?.find(
        (resolutionItem: JudgeResolutionItem) => resolutionItem?.organization_unit?.id === orgItem.id,
      );

      const currResolutionItem =
        resolutionItem?.items?.find((i: JudgeResolutionItem) => i.organization_unit.id === orgItem.id) ?? defaultValues;

      return {
        ...currResolutionItem,
        organization_unit: {id: orgItem.id, title: orgItem.title},
        number_of_judges: realJudgeStats?.number_of_judges,
        number_of_presidents: realJudgeStats?.number_of_presidents,
        id: nanoid(),
      };
    });
  }, [realJudgeNumberData, organizationUnits, resolutionItem]);

  useEffect(() => {
    const resolutions: any = {};
    // Creating inputs for each of the organization units in the table
    list.forEach((listItem: any) => {
      resolutions[listItem.organization_unit.id] = {
        ...listItem,
        organization_unit: listItem.organization_unit,
      };
    });

    const initialValues = {
      id: resolutionItem?.id ?? 0,
      user_profile_id: 1,
      serial_number: resolutionItem?.serial_number ?? '',
      resolutions,
    };

    reset(initialValues);
  }, [resolutionItem, list]);

  const updatedTableHeads = useMemo(() => {
    // Going through tableHeads and adding a renderContents method to the table heads that need a dynamic input
    const tableHeads = judgeResolutionTableHeads;
    const positiveIntegerRegex = /^(?:[1-9]\d*|0)?$/;

    tableHeads.forEach((head: TableHead) => {
      switch (head.accessor) {
        case 'total':
          head.renderContents = (_, resolution: JudgeResolutionItem) => {
            const judgeDecision = +watch(`resolutions[${resolution?.organization_unit?.id}].available_slots_judges`);
            return <Typography content={judgeDecision > 0 ? judgeDecision + 1 : 1} />;
          };
          break;
        case 'available_slots_judges':
          head.renderContents = (_, resolution: JudgeResolutionItem) => {
            const numberOfJudges = +watch(`resolutions[${resolution?.organization_unit?.id}].number_of_judges`);
            const resolutionErrors = errors?.resolutions as any;
            return (
              <Input
                {...register(`resolutions[${resolution?.organization_unit?.id}].available_slots_judges`, {
                  required: 'Ovo polje je obavezno',
                  min: {
                    value: numberOfJudges,
                    message: `Broj sudija ne može biti manji od ${numberOfJudges}`,
                  },
                })}
                value={watch(`resolutions[${resolution?.organization_unit?.id}].available_slots_judges`)}
                disabled={isDisabled}
                type="number"
                error={
                  resolutionErrors
                    ? resolutionErrors[resolution?.organization_unit?.id]?.available_slots_judges?.message
                    : ''
                }
              />
            );
          };
          break;
        default:
          return;
      }
    });

    return tableHeads;
  }, [isDisabled, resolutionItem, list, errors]);

  return (
    <ScreenWrapper>
      <OverviewBox>
        <MainTitle variant="bodyMedium" content="DETALJI ODLUKE" />
        <Divider color="#615959" height="1px" />

        <CustomTable
          tableHeads={updatedTableHeads}
          isLoading={isLoading}
          data={resolutions ? Object.values(resolutions) : []}
          titleElement={
            <Filters>
              <Input
                {...register('serial_number', {required: 'Redni broj je obavezan'})}
                label="REDNI BROJ:"
                style={{width: 300}}
                error={errors.serial_number?.message as string}
                placeholder="Unesite redni broj"
                disabled={isDisabled}
              />
            </Filters>
          }
        />
        <FormFooter>
          {(resolutionItem?.active || isNew) && (
            <Controls>
              {isDisabled ? (
                <Button content="Uredi" variant="secondary" onClick={() => setIsDisabled(false)} />
              ) : (
                <Button content="Sačuvaj " variant="secondary" onClick={handleSubmit(handleSave)} />
              )}
            </Controls>
          )}
        </FormFooter>
      </OverviewBox>
    </ScreenWrapper>
  );
};
