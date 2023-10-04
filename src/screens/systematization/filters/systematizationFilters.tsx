import {Dropdown, Input, SearchIcon, Theme} from 'client-library';
import React from 'react';
import useGetOrganizationUnits from '../../../services/graphql/organizationUnits/useGetOrganizationUnits';
import {yearsForDropdownFilter} from '../../../utils/constants';
import {SystematizationFiltersProps} from '../types';
import {FiltersContainer} from './style';

export const SystematizationFilters: React.FC<SystematizationFiltersProps> = ({setFilters, filters}: any) => {
  const {organizationUnits} = useGetOrganizationUnits(undefined, {allOption: true});
  const yearOptions = yearsForDropdownFilter();

  const onFilterChange = (name: string, value: any) => {
    if (name === 'search') {
      console.log(value);
      setFilters('search', value.target.value);
    } else {
      setFilters(name, value.id);
    }
  };

  return (
    <FiltersContainer>
      <Input
        value={filters.search}
        name="search"
        onChange={value => onFilterChange('search', value)}
        label="BROJ SISTEMATIZACIJE:"
        rightContent={<SearchIcon style={{marginInline: 10}} stroke={Theme.palette.gray300} />}
      />
      <Dropdown
        value={yearOptions.find(year => year.id === filters.year)}
        name="year"
        onChange={value => onFilterChange('year', value)}
        label="GODINA:"
        options={yearOptions}
      />
      <Dropdown
        value={organizationUnits.find(orgUnit => orgUnit.id === filters.organization_unit_id)}
        name="organization_unit_id"
        onChange={value => onFilterChange('organization_unit_id', value)}
        label="ORG. JEDINICA:"
        options={organizationUnits}
      />
    </FiltersContainer>
  );
};
