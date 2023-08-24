import React, {useEffect, useMemo} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {Dropdown, Input, SearchIcon, Theme} from 'client-library';
import {Wrapper} from './style';
import {yearsForDropdownFilter} from '../../../utils/constants';
import useOrganizationUnits from '../../../services/graphql/organizationUnits/useOrganizationUnits';
import {SystematizationFiltersProps} from '../types';

const initialValues = {
  systematization_number: null,
  organization_unit_id: null,
  year: null,
};

export const SystematizationFilters: React.FC<SystematizationFiltersProps> = ({setFilters, data, context}: any) => {
  const {register, control, watch} = useForm({defaultValues: data || initialValues});
  const years = yearsForDropdownFilter();

  const {organizationUnitsList} = useOrganizationUnits(context, true);
  const unit = watch('organization_unit_id');
  const search = watch('systematization_number');
  const year = watch('year');

  useEffect(() => {
    if (unit !== 0) {
      setFilters({organization_unit_id: unit?.id, search: null, year: null});
    }
    setFilters({search: search, year: year?.id});
  }, [unit, year, search]);

  return (
    <Wrapper>
      <Input
        {...register('systematization_number')}
        label="BROJ SISTEMATIZACIJE:"
        rightContent={<SearchIcon style={{marginLeft: 10, marginRight: 10}} stroke={Theme.palette.gray300} />}
      />
      <Controller
        name="year"
        control={control}
        render={({field: {onChange, name, value}}) => {
          return (
            <Dropdown onChange={onChange} value={value as any} name={name} label="GODINA:" options={years as any} />
          );
        }}
      />

      <Controller
        name="organization_unit_id"
        control={control}
        render={({field: {onChange, name, value}}) => {
          return (
            <Dropdown
              onChange={onChange}
              value={value as any}
              name={name}
              label="ORGANIZACIONA JEDINICA:"
              options={organizationUnitsList as any}
              placeholder={value}
            />
          );
        }}
      />
    </Wrapper>
  );
};
