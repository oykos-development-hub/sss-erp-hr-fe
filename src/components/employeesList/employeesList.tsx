import React, {ChangeEvent, RefObject, useMemo, useRef} from 'react';
import {Controls, FilterDropdown, FilterInput, Filters, Header, MainTitle, OverviewBox} from './styles';
import {tableHeads} from '../../screens/employees/constants';
import {Button, Pagination, Table, Divider, Theme, SearchIcon} from 'client-library';
import {UserProfile} from '../../types/graphql/userProfiles';
import useOrganizationUnits from '../../services/graphql/organizationUnits/useOrganizationUnits';
import {EmployeeListFilters} from '../../screens/employees';
import {statusOptions} from '../../constants';
import useJobPositions from '../../services/graphql/jobPositions/useJobPositionOverview';
import {scrollToTheNextElement} from '../../utils/scrollToTheNextElement';

export interface EmployeesListProps {
  navigate: (path: string) => void;
  toggleEmployeeImportModal: () => void;
  onPageChange: (page: number) => void;
  data: any;
  search: string;
  filters: EmployeeListFilters;
  onFilterChange: (value: any, name: string) => void;
  onSearch: (e: ChangeEvent<HTMLInputElement>) => void;
  parentRef: RefObject<HTMLDivElement>;
}

const EmployeesList: React.FC<EmployeesListProps> = ({
  navigate,
  toggleEmployeeImportModal,
  onPageChange,
  data,
  search,
  filters,
  onFilterChange,
  onSearch,
  parentRef,
}) => {
  const overviewRef = useRef<HTMLDivElement>(null);

  const {organizationUnits} = useOrganizationUnits();

  const {data: jobPositions} = useJobPositions('');

  const organizationUnitsList = useMemo(() => {
    return organizationUnits
      ? [
          {id: 0, title: 'Sve organizacione jedinice'},
          ...organizationUnits
            .filter(i => !i.parent_id)
            .map(unit => {
              return {id: unit.id, title: unit.title};
            }),
        ]
      : [];
  }, [organizationUnits]);

  const list = useMemo(
    () =>
      data?.items?.map((item: UserProfile) => ({
        full_name: `${item.first_name} ${item.last_name}`,
        ...item,
        active: item.active ? 'Aktivan' : 'Neaktivan',
      })),
    [data],
  );

  const jobPositionOptions = useMemo(() => {
    return [
      {id: 0, title: 'Sva radna mjesta'},
      ...(jobPositions?.items
        ? jobPositions.items.map((jobPosition: any) => ({id: jobPosition.id, title: jobPosition.title}))
        : []),
    ];
  }, [jobPositions]);

  return (
    <OverviewBox ref={overviewRef}>
      <MainTitle variant="bodyMedium" content="PREGLED SVIH ZAPOSLENIH" />
      {/*TODO: theme color */}
      <Divider color={Theme?.palette?.gray200} height="1px" />
      <Header>
        <Filters>
          <FilterDropdown
            label="FILTER ORGANIZACIONIH JEDINICA:"
            options={organizationUnitsList as any}
            onChange={value => onFilterChange(value, 'organization_unit_id')}
            value={filters.organization_unit_id as any}
            name="organization_unit_id"
            placeholder="Odaberite organizacionu jedinicu"
          />

          <FilterDropdown
            label="RADNO MJESTO:"
            options={jobPositionOptions as any}
            onChange={value => onFilterChange(value, 'job_position_id')}
            value={filters.job_position_id as any}
            name="job_position_id"
            placeholder="Odaberite radno mjesto"
          />

          <FilterDropdown
            label="STATUS:"
            options={statusOptions as any}
            onChange={value => onFilterChange(value, 'is_active')}
            value={filters.is_active as any}
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
            content="Uvoz zaposlenih"
            variant="secondary"
            style={{marginRight: 10, width: 170}}
            onClick={() => toggleEmployeeImportModal()}
          />
          <Button
            content="Dodaj zaposlenog"
            variant="secondary"
            style={{width: 170}}
            onClick={() => {
              navigate('/hr/employees/details/basic-info');
              scrollToTheNextElement(parentRef, overviewRef);
            }}
          />
        </Controls>
      </Header>
      <Table
        tableHeads={tableHeads}
        data={list}
        style={{marginBottom: 22}}
        onRowClick={row => {
          navigate(`/hr/employees/details/${row.id}/basic-info`);
          scrollToTheNextElement(parentRef, overviewRef);
        }}
      />
      <Pagination
        pageCount={Math.ceil(data.total / 10)}
        onChange={onPageChange}
        variant="filled"
        itemsPerPage={2}
        previousLabel="Previous"
        nextLabel="Next"
        pageRangeDisplayed={3}
      />
    </OverviewBox>
  );
};

export default EmployeesList;
