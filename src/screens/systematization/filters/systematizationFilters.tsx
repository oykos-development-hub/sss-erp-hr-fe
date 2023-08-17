import React, {useEffect} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {Dropdown, Input, SearchIcon, Theme} from 'client-library';
import {Wrapper} from './style';
import {yearsForDropdown} from '../../../utils/constants';
import useOrganizationUnits from '../../../services/graphql/organizationUnits/useOrganizationUnits';
import {SystematizationFiltersProps} from '../types';

const initialValues = {
  systematization_number: 0,
  year: 0,
  organization_unit_id: 0,
};

export const SystematizationFilters: React.FC<SystematizationFiltersProps> = ({setFilters, data, context}: any) => {
  const {register, control, watch} = useForm({defaultValues: data || initialValues});
  const years = yearsForDropdown();
  const {organizationUnitsList} = useOrganizationUnits(context);
  const unit = watch('organization_unit_id');

  useEffect(() => {
    unit !== 0 && setFilters({organization_unit_id: unit?.id});
  }, [unit]);

  return (
    <Wrapper>
      <Input
        {...register('systematization_number', {required: 'Ovo polje je obavezno'})}
        label="BROJ SISTEMATIZACIJE:"
        rightContent={<SearchIcon style={{marginLeft: 10, marginRight: 10}} stroke={Theme.palette.gray300} />}
      />
      <Controller
        name="year"
        control={control}
        render={({field: {onChange, name, value}}) => {
          return <Dropdown onChange={onChange} value={value as any} name={name} label="GODINA:" options={years} />;
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
