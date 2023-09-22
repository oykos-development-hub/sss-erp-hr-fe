import {Button, Divider, Input, TableHead} from 'client-library';
import {nanoid} from 'nanoid';
import React, {useEffect, useMemo, useState} from 'react';
import {useForm} from 'react-hook-form';
import {OverviewBox} from '../../../components/employeesList/styles';
import useJudgeResolutionsInsert from '../../../services/graphql/judges/useJudgeResolutionInsert';
import useJudgeResolutionsOverview from '../../../services/graphql/judges/useJudgeResolutionOverview';
import useOrganizationUintCalculateEmployeeStats from '../../../services/graphql/judges/useOrganizationUintCalculateEmployeeStats';
import useOrganizationUnits from '../../../services/graphql/organizationUnits/useOrganizationUnits';
import {MainTitle} from '../../../shared/mainTitle';
import {ScreenWrapper} from '../../../shared/screenWrapper';
import {DropdownDataString} from '../../../types/dropdownData';
import {JudgeResolutionItem, JudgeResolutionOverview} from '../../../types/graphql/judges';
import {OrganizationUnit} from '../../../types/graphql/organizationUnitsTypes';
import {ScreenProps} from '../../../types/screen-props';
import {judgeResolutionTableHeads} from '../judgeNorms/constants';
import {Controls, CustomTable, Filters, FormFooter} from './styles';

export interface JudgesNumbersDetailsListProps extends ScreenProps {
  isNew?: boolean;
}

interface DecisionForm {
  id: number;
  user_profile_id: number;
  serial_number: string;
  year: DropdownDataString | null;
  items: {[key: string]: number};
}

const initialValues = {
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
  const [judgeInputs, setJudgeInputs] = useState<{[key: string]: string}>({});
  const {organizationUnits} = useOrganizationUnits();
  const {organizationUintCalculateEmployee} = useOrganizationUintCalculateEmployeeStats();

  const id = context.navigation.location.pathname.split('/')[4];

  const {data, refetch} = useJudgeResolutionsOverview({page: 1, size: 1000});

  const {mutate} = useJudgeResolutionsInsert();

  const item = data?.find((i: JudgeResolutionOverview) => i.id === Number(id));

  // constructing initial values for the form, serial number, year and dynamic number of fields for judge number based on org units
  const getInitialValues = useMemo(() => {
    const values: any = {};

    organizationUnits
      ?.filter(orgItem => !!orgItem.id && !orgItem.parent_id)
      .forEach((unit: OrganizationUnit) => {
        values[unit.id] = item
          ? item?.items?.find((i: JudgeResolutionItem) => {
              return i.organization_unit.id === unit.id;
            })?.available_slots_judges
          : '';
      });

    return {
      id: item?.id ?? 0,
      user_profile_id: 1,
      serial_number: item?.serial_number ?? '',
      items: values,
    };
  }, [organizationUnits, item]);

  const list = useMemo(() => {
    return organizationUnits
      .filter(unit => !unit.parent_id && unit.id)
      .map((orgItem: OrganizationUnit) => {
        let dataValue;

        if (
          id === 'new-decision' &&
          Array.isArray(organizationUintCalculateEmployee) &&
          organizationUintCalculateEmployee?.length > 0
        )
          dataValue = organizationUintCalculateEmployee?.find(
            (itemEmployeeStats: JudgeResolutionItem) => itemEmployeeStats?.organization_unit?.id === orgItem.id,
          );
        const itemFromList = item?.items?.find((i: JudgeResolutionItem) => i.organization_unit.id === orgItem.id) ?? {
          ...initialValues,
          number_of_judges: dataValue?.number_of_judges,
          number_of_presidents: dataValue?.number_of_presidents,
          id: nanoid(),
        };

        return {
          ...itemFromList,
          organization_unit: {id: orgItem.id, title: orgItem.title},
        };
      });
  }, [organizationUnits, item, organizationUintCalculateEmployee]);

  const {
    register,
    handleSubmit,
    formState: {errors},
    control,
    reset,
  } = useForm<DecisionForm>({defaultValues: getInitialValues});

  const judgeNumberTableHead: TableHead = {
    title: 'Odluka o broju sudija',
    accessor: 'available_slots_judges',
    type: 'custom',
    renderContents: (_, item) => (
      <Input
        {...register(`items.${item.organization_unit.id}`, {required: 'Ovo polje je obavezno'})}
        disabled={isDisabled}
        onChange={e => handleInputChange(e, item.organization_unit.id)}
        value={judgeInputs[item.organization_unit.id]}
      />
    ),
  };

  const handleSave = (values: DecisionForm, close: boolean) => {
    setIsDisabled(true);

    const data = {
      id: values.id,
      serial_number: values.serial_number,
      year: values.year?.id ?? '',
      active: true,
      items: Object.keys(values.items).map(key => ({
        organization_unit_id: Number(key),
        number_of_judges: Number(values.items[key]),
        number_of_presidents: 1,
        id: item?.items.find(i => i.organization_unit.id === Number(key))?.id ?? 0,
      })),
    };

    mutate(
      data,
      id => {
        setIsDisabled(true);
        context.alert.success('Uspješno sačuvano.');
        if (close) {
          context.navigation.navigate('/hr/judges/number-decision');
          context.breadcrumbs.remove();
        } else {
          refetch();
          context.navigation.navigate(`/hr/judges/number-decision/${id}`);
        }
      },
      () => {
        context.alert.error('Greška. Promjene nisu sačuvane.');
      },
    );
  };

  useEffect(() => {
    if (getInitialValues) {
      reset(getInitialValues);
    }
  }, [getInitialValues]);

  const handleInputChange = (event: any, id: any) => {
    const value = event.target.value;
    setJudgeInputs(prevState => ({
      ...prevState,
      [id]: value,
    }));
  };

  return (
    <ScreenWrapper context={context}>
      <OverviewBox>
        <MainTitle variant="bodyMedium" content="DETALJI ODLUKE" />
        {/*TODO: theme color */}
        <Divider color="#615959" height="1px" />

        <CustomTable
          titleElement={
            <Filters>
              <Input
                {...register('serial_number', {required: 'Redni broj je obavezan'})}
                label="REDNI BROJ:"
                style={{width: 300}}
                error={errors.serial_number?.message}
                placeholder="Unesite redni broj"
                disabled={isDisabled}
              />
            </Filters>
          }
          tableHeads={[
            ...judgeResolutionTableHeads(judgeInputs).slice(0, 2),
            judgeNumberTableHead,
            ...judgeResolutionTableHeads(judgeInputs).slice(3),
          ]}
          data={(list as any) || []}
        />
        <FormFooter>
          <Controls>
            {isDisabled ? (
              <Button content="Uredi" variant="secondary" onClick={() => setIsDisabled(false)} />
            ) : (
              <Button
                content="Sačuvaj "
                variant="secondary"
                onClick={handleSubmit(values => handleSave(values, true))}
              />
            )}
          </Controls>
        </FormFooter>
      </OverviewBox>
    </ScreenWrapper>
  );
};
