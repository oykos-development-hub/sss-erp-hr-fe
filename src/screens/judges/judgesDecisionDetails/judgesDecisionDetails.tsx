import {Button, Divider, Input, TableHead, Typography} from 'client-library';
import {nanoid} from 'nanoid';
import React, {ChangeEvent, useEffect, useMemo, useState} from 'react';
import {useForm} from 'react-hook-form';
import {OverviewBox} from '../../../components/employeesList/styles';
import useJudgeResolutionsInsert from '../../../services/graphql/judges/useJudgeResolutionInsert';
import useJudgeResolutionsOverview from '../../../services/graphql/judges/useJudgeResolutionOverview';
import useOrganizationUintCalculateEmployeeStats from '../../../services/graphql/judges/useOrganizationUintCalculateEmployeeStats';
import useGetOrganizationUnits from '../../../services/graphql/organizationUnits/useGetOrganizationUnits';
import {MainTitle} from '../../../shared/mainTitle';
import {ScreenWrapper} from '../../../shared/screenWrapper/screenWrapper';
import {DropdownDataNumber, DropdownDataString} from '../../../types/dropdownData';
import {JudgeResolutionItem, JudgeResolutionOverview} from '../../../types/graphql/judges';
import {ScreenProps} from '../../../types/screen-props';
import {judgeResolutionTableHeads} from '../judgeNorms/constants';
import {Controls, CustomTable, Filters, FormFooter} from './styles';

export interface JudgesNumbersDetailsListProps extends ScreenProps {
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

export const JudgesNumbersDetails: React.FC<JudgesNumbersDetailsListProps> = ({context, isNew}) => {
  const [isDisabled, setIsDisabled] = useState<boolean>(isNew ? false : true);
  const {organizationUnits} = useGetOrganizationUnits();
  const {judgesData: realJudgeNumberData} = useOrganizationUintCalculateEmployeeStats();
  const {data, refetch} = useJudgeResolutionsOverview({page: 1, size: 1000});
  const {mutate} = useJudgeResolutionsInsert();

  const id = context.navigation.location.pathname.split('/')[4];

  const resolutionItem = useMemo(
    () => data.find((resolution: JudgeResolutionOverview) => resolution.id === +id),
    [data, id],
  );

  const {
    register,
    handleSubmit,
    formState: {errors},
    reset,
    watch,
  } = useForm();

  const resolutions = watch('resolutions');

  const handleSave = (values: any) => {
    // setIsDisabled(true);

    const data = {
      id: values.id,
      serial_number: values.serial_number,
      year: values.year?.id ?? '',
      active: true,
      items: Object.keys(values.resolutions).map(key => ({
        organization_unit_id: +key,
        number_of_judges: +values.resolutions[key].available_slots_judges,
        number_of_presidents: 1,
        id: resolutionItem?.items.find(i => i.organization_unit.id === +key)?.id ?? 0,
      })),
    };

    console.log(data);

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

    // if (isNew) {
    //   orgUnits = organizationUnits;
    // } else {
    //   orgUnits = resolutionItem?.items.map(i => i.organization_unit) ?? [];
    // }

    orgUnits = organizationUnits.filter(ou => ou.title.indexOf('Sudski savjet') === -1);

    return orgUnits.map((orgItem: any) => {
      let realJudgeStats;

      if (isNew) {
        realJudgeStats = realJudgeNumberData?.find(
          (resolutionItem: JudgeResolutionItem) => resolutionItem?.organization_unit?.id === orgItem.id,
        );
      }

      const currResolutionItem = resolutionItem?.items?.find(
        (i: JudgeResolutionItem) => i.organization_unit.id === orgItem.id,
      ) ?? {
        ...defaultValues,
        number_of_judges: realJudgeStats?.number_of_judges,
        number_of_presidents: realJudgeStats?.number_of_presidents,
        id: nanoid(),
      };

      return {
        ...currResolutionItem,
        organization_unit: {id: orgItem.id, title: orgItem.title},
      };
    });
  }, [realJudgeNumberData, organizationUnits, resolutionItem]);

  useEffect(() => {
    const resolutions: any = {};
    console.log(resolutionItem);
    // Creating inputs for each of the organization units in the table
    list.forEach((listItem: any) => {
      resolutions[listItem.organization_unit.id] = {
        ...(!isNew
          ? resolutionItem?.items?.find((resolution: JudgeResolutionItem) => {
              return resolution.organization_unit.id === listItem.organization_unit.id;
            })
          : defaultValues),
        organization_unit: listItem.organization_unit,
        id: nanoid(),
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
    // Going throught tableHeads and adding a renderContents method to the table heads that need a dynamic input
    const tableHeads = judgeResolutionTableHeads;

    tableHeads.forEach((head: TableHead) => {
      switch (head.accessor) {
        case 'total':
          head.renderContents = (_, resolution: JudgeResolutionItem) => {
            const judgeDecision = watch(`resolutions[${resolution?.organization_unit?.id}].available_slots_judges`);
            return <Typography content={judgeDecision} />;
          };
          break;
        case 'available_slots_judges':
          head.renderContents = (_, resolution: JudgeResolutionItem) => (
            <Input
              {...register(`resolutions[${resolution?.organization_unit?.id}].available_slots_judges`, {
                required: 'Ovo polje je obavezno',
                min: {value: 0, message: 'Broj sudija ne može biti manji od 0'},
              })}
              disabled={isDisabled}
              type="number"
            />
          );
          break;
        default:
          return;
      }
    });

    return tableHeads;
  }, [isDisabled, resolutionItem, list]);

  return (
    <ScreenWrapper>
      <OverviewBox>
        <MainTitle variant="bodyMedium" content="DETALJI ODLUKE" />
        <Divider color="#615959" height="1px" />

        <CustomTable
          tableHeads={updatedTableHeads}
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
          <Controls>
            {isDisabled ? (
              <Button content="Uredi" variant="secondary" onClick={() => setIsDisabled(false)} />
            ) : (
              <Button content="Sačuvaj " variant="secondary" onClick={handleSubmit(handleSave)} />
            )}
          </Controls>
        </FormFooter>
      </OverviewBox>
    </ScreenWrapper>
  );
};
