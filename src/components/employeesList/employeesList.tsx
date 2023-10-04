import React, {ChangeEvent, RefObject, useEffect, useMemo, useRef} from 'react';
import {Controls, FilterDropdown, FilterInput, Filters, Header, MainTitle, OverviewBox} from './styles';
import {tableHeads} from '../../screens/employees/constants';
import {Button, Pagination, Table, Divider, Theme, SearchIcon} from 'client-library';
import {UserProfile} from '../../types/graphql/userProfiles';
import {EmployeeListFilters} from '../../screens/employees';
import {statusOptions} from '../../constants';
import useJobPositions from '../../services/graphql/jobPositions/useJobPositionOverview';
import {scrollToTheNextElement} from '../../utils/scrollToTheNextElement';
import useGetOrganizationUnits from '../../services/graphql/organizationUnits/useGetOrganizationUnits';

export interface EmployeesListProps {
  navigation?: any;
  toggleEmployeeImportModal: () => void;
  onPageChange: (page: number) => void;
  search: string;
  filters: EmployeeListFilters;
  onFilterChange: (value: any, name: string) => void;
  onSearch: (e: ChangeEvent<HTMLInputElement>) => void;
  parentRef: RefObject<HTMLDivElement>;
  loading: boolean;
  data: {
    items: UserProfile[];
    total: number;
  };
}

const EmployeesList: React.FC<EmployeesListProps> = ({
  navigation,
  onPageChange,
  data,
  search,
  filters,
  onFilterChange,
  onSearch,
  parentRef,
  loading,
}) => {
  const overviewRef = useRef<HTMLDivElement>(null);
  const state = navigation.location.state;
  const isDetails = navigation.location.pathname.split('/').length === 6;

  const {organizationUnits} = useGetOrganizationUnits(undefined, {allOption: true});
  const {data: jobPositions} = useJobPositions('');

  const userProfileList = data.items
    ? data?.items?.map((item: UserProfile) => ({
        full_name: `${item.first_name} ${item.last_name}`,
        ...item,
        active: item.active ? 'Aktivan' : 'Neaktivan',
      }))
    : [];

  const jobPositionOptions = [
    {id: 0, title: 'Sva radna mjesta'},
    ...(jobPositions?.items
      ? jobPositions.items.map((jobPosition: any) => ({id: jobPosition.id, title: jobPosition.title}))
      : []),
  ];

  useEffect(() => {
    if (state?.scroll || isDetails) {
      scrollToTheNextElement(parentRef, overviewRef);
    }
  }, [isDetails]);

  return (
    <OverviewBox ref={overviewRef}>
      <MainTitle variant="bodyMedium" content="PREGLED SVIH ZAPOSLENIH" />
      <Divider color={Theme?.palette?.gray200} height="1px" />
      <Header>
        <Filters>
          <FilterDropdown
            label="FILTER ORGANIZACIONIH JEDINICA:"
            options={organizationUnits}
            onChange={value => onFilterChange(value, 'organization_unit_id')}
            value={filters.organization_unit_id}
            name="organization_unit_id"
            placeholder="Odaberite organizacionu jedinicu"
          />

          <FilterDropdown
            label="RADNO MJESTO:"
            options={jobPositionOptions}
            onChange={value => onFilterChange(value, 'job_position_id')}
            value={filters.job_position_id}
            name="job_position_id"
            placeholder="Odaberite radno mjesto"
          />

          <FilterDropdown
            label="STATUS:"
            options={statusOptions as any}
            onChange={value => onFilterChange(value, 'is_active')}
            value={filters.is_active}
            name="is_active"
            placeholder="Odaberite status"
          />

          <FilterInput
            onChange={onSearch}
            label="PRETRAGA PO IMENU I PREZIMENU:"
            value={search}
            rightContent={<SearchIcon />}
            placeholder="Unesite ime i prezime"
          />
        </Filters>
        <Controls>
          <Button
            content="Dodaj zaposlenog"
            variant="secondary"
            style={{width: 170}}
            onClick={() => {
              navigation.navigate('/hr/employees/add-new');
            }}
          />
        </Controls>
      </Header>
      <Table
        tableHeads={tableHeads}
        data={userProfileList}
        style={{marginBottom: 22}}
        isLoading={loading}
        onRowClick={row => {
          navigation.navigate(`/hr/employees/details/${row.id}/basic-info`);
          scrollToTheNextElement(parentRef, overviewRef);
        }}
      />
      <Pagination
        pageCount={Math.ceil(data.total / 10)}
        onChange={onPageChange}
        variant="filled"
        itemsPerPage={2}
        pageRangeDisplayed={3}
      />
    </OverviewBox>
  );
};

export default EmployeesList;
