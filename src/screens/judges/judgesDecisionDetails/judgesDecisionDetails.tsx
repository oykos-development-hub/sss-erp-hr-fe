import {Button, Divider, Table, Input, TableHead} from 'client-library';
import React, {useEffect, useMemo, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {Controls, Filters, FormFooter} from './styles';
import {OverviewBox} from '../../../components/employeesList/styles';
import useOrganizationUnits from '../../../services/graphql/organizationUnits/useOrganizationUnits';
import {MainTitle} from '../../../shared/mainTitle';
import {JudgeResolutionOverview, JudgeResolutionItem} from '../../../types/graphql/judges';
import {yearsForDropdown} from '../../../utils/constants';
import {judgeResolutionTableHeads} from '../judgeNorms/constants';
import {ScreenProps} from '../../../types/screen-props';
import {FilterDropdown} from '../../../components/judgesList/styles';
import useJudgeResolutionsOverview from '../../../services/graphql/judges/useJudgeResolutionOverview';
import {OrganizationUnit} from '../../../types/graphql/organizationUnitsTypes';
import {nanoid} from 'nanoid';
import {DropdownDataString} from '../../../types/dropdownData';
import useJudgeResolutionsInsert from '../../../services/graphql/judges/useJudgeResolutionInsert';
import {ScreenWrapper} from '../../../shared/screenWrapper';

// If you start experiencing pain in your brain while looking at this code, talk to Petar.

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
  available_slots_presidents: 0,
  available_slots_judges: 0,
  number_of_judges: 0,
  number_of_presidents: 0,
  number_of_employees: 0,
  number_of_relocated_judges: 0,
  number_of_suspended_judges: 0,
};

export const JudgesNumbersDetails: React.FC<JudgesNumbersDetailsListProps> = ({context, isNew}) => {
  const [isDisabled, setIsDisabled] = useState<boolean>(isNew ? false : true);
  const {organizationUnits} = useOrganizationUnits();

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
      year: item?.year ? {id: item?.year, title: item?.year} : null,
      items: values,
    };
  }, [organizationUnits, item]);

  const list = useMemo(() => {
    return organizationUnits
      .filter(unit => !unit.parent_id && unit.id)
      .map((orgItem: OrganizationUnit) => {
        const itemFromList = item?.items?.find((i: JudgeResolutionItem) => i.organization_unit.id === orgItem.id) ?? {
          ...initialValues,
          id: nanoid(),
        };

        return {
          ...itemFromList,
          organization_unit: {id: orgItem.id, title: orgItem.title},
        };
      });
  }, [organizationUnits, item]);

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
        context.alert.success('Uspješno ste sačuvali odluku');
        if (close) {
          context.navigation.navigate('/hr/judges/number-decision');
          context.breadcrumbs.remove();
        } else {
          refetch();
          context.navigation.navigate(`/hr/judges/number-decision/${id}`);
        }
      },
      () => {
        context.alert.error('Došlo je do greške prilikom čuvanja odluke');
      },
    );
  };

  const availableYears = useMemo(() => {
    const yearOptions = [...yearsForDropdown().map(year => ({id: year.id.toString(), title: year.title.toString()}))];
    return data ? yearOptions.filter(year => !data.find(resolution => resolution.year === year.id)) : [];
  }, [data]);

  useEffect(() => {
    if (getInitialValues) {
      reset(getInitialValues);
    }
  }, [getInitialValues]);

  return (
    <ScreenWrapper context={context}>
      <OverviewBox>
        <MainTitle variant="bodyMedium" content="DETALJI ODLUKE" />
        {/*TODO: theme color */}
        <Divider color="#615959" height="1px" />
        <div>
          <Filters>
            <Input
              {...register('serial_number', {required: 'Redni broj je obavezan'})}
              label="REDNI BROJ:"
              style={{width: 300}}
              error={errors.serial_number?.message}
              placeholder="Unesite redni broj"
              disabled={isDisabled}
            />
            <Controller
              control={control}
              rules={{required: 'Godina je obavezna'}}
              name="year"
              render={({field: {onChange, name, value}}) => (
                <FilterDropdown
                  label="GODINA:"
                  name={name}
                  options={availableYears as any}
                  value={value as any}
                  onChange={onChange}
                  placeholder="Odaberite godinu"
                  error={errors.year?.message}
                  isDisabled={isDisabled}
                />
              )}
            />
          </Filters>
        </div>

        <Table
          tableHeads={[
            ...judgeResolutionTableHeads.slice(0, 2),
            judgeNumberTableHead,
            ...judgeResolutionTableHeads.slice(3),
          ]}
          data={(list as any) || []}
          style={{marginBottom: 22}}
        />
        <FormFooter>
          <Controls>
            {isDisabled ? (
              <Button content="Uredi" variant="secondary" onClick={() => setIsDisabled(false)} />
            ) : (
              <>
                <Button
                  content="Sačuvaj i zatvori"
                  variant="secondary"
                  onClick={handleSubmit(values => handleSave(values, true))}
                />
                <Button
                  content="Sačuvaj i nastavi"
                  variant="primary"
                  onClick={handleSubmit(values => handleSave(values, false))}
                />
              </>
            )}
          </Controls>
        </FormFooter>
      </OverviewBox>
    </ScreenWrapper>
  );
};
