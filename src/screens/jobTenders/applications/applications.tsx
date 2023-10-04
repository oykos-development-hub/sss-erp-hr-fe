import React from 'react';
import {Divider, Pagination, Table, Theme, SearchIcon} from 'client-library';
import {useState} from 'react';
import useJobTenderApplications from '../../../services/graphql/jobTenders/useJobTenderApplicationOverview';
import {MainTitle} from '../../../shared/mainTitle';
import {ScreenWrapper} from '../../../shared/screenWrapper/screenWrapper';
import SectionBox from '../../../shared/sectionBox';
import {ApplicationScreenFilters, JobTenderApplication} from '../../../types/graphql/jobTenders';
import {ScreenProps} from '../../../types/screen-props';
import {applicationsTableHeads} from '../constants';
import useGetOrganizationUnits from '../../../services/graphql/organizationUnits/useGetOrganizationUnits';
import useJobTendersTypesSearch from '../../../services/graphql/jobPositions/useJobTendersTypesSearch';
import {useDebounce} from '../../../utils/useDebounce';
import {FilterDropdown, FilterInput, FilterWrapper} from './style';

const initialValues: ApplicationScreenFilters = {
  organization_unit_id: undefined,
  type_id: undefined,
};

const ApplicationsScreen = (props: ScreenProps) => {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<any>(initialValues);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);
  const {data: applications, loading} = useJobTenderApplications({page, size: 10, ...filters, search: debouncedSearch});
  const {typesUnitsList} = useJobTendersTypesSearch('');
  const {organizationUnits} = useGetOrganizationUnits(undefined, {allOption: true});

  const tableData = applications?.items?.map((item: JobTenderApplication) => ({
    ...item,
    full_name: `${item.first_name} ${item.last_name}` || '',
  }));

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const onFilterChange = (value: any, name: string) => {
    setFilters({...filters, [name]: value});
  };

  const onPageChange = (page: number) => {
    setPage(page + 1);
  };

  const navigateToDetails = (item: JobTenderApplication) => {
    props.context.navigation.navigate(`/hr/job-tenders/job-tender-applications/${item.id}`);
    props.context.breadcrumbs.add({
      name: `${item.id}`,
      to: `/hr/job-tenders/job-tender-applications/${item.id}`,
    });
  };

  return (
    <ScreenWrapper>
      <SectionBox style={{marginTop: 25}}>
        <MainTitle content="PREGLED SVIH KANDIDATA" />
        <Divider color={Theme?.palette?.gray200} height="1px" />

        <FilterWrapper>
          <FilterDropdown
            label="TIP OGLASA:"
            name="type_id"
            onChange={(value: any) => onFilterChange(value, 'type_id')}
            value={filters.type_id}
            options={typesUnitsList}
            placeholder="Tip oglasa:"
          />
          <FilterDropdown
            label="ORGANIZACIONA JEDINICA:"
            name="organization_unit_id"
            onChange={(value: any) => onFilterChange(value, 'organization_unit_id')}
            value={filters.organization_unit_id}
            options={organizationUnits}
            placeholder="Odaberite organizacionu jedinicu"
          />

          <FilterInput
            label="PRETRAGA PO IMENU:"
            placeholder="Unesi Pretragu"
            onChange={onSearch}
            value={search}
            rightContent={<SearchIcon />}
          />
        </FilterWrapper>

        <Table
          tableHeads={applicationsTableHeads}
          data={tableData || []}
          style={{marginBottom: 22}}
          onRowClick={navigateToDetails}
          isLoading={loading}
        />
        <Pagination
          pageCount={applications.total / 10}
          onChange={onPageChange}
          variant="filled"
          itemsPerPage={2}
          pageRangeDisplayed={3}
        />
      </SectionBox>
    </ScreenWrapper>
  );
};

export default ApplicationsScreen;
