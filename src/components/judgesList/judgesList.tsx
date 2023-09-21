import React, {useMemo} from 'react';
import {Button, Divider, Pagination, Table} from 'client-library';
import {JudgesListFilters} from '../../screens/judges/judgeNorms/judges';
import {JudgeOverview} from '../../types/graphql/judges';
import {Controls, FilterDropdown, Filters, Header, MainTitle, OverviewBox} from './styles';
import {judgeTableHeads} from '../../screens/judges/judgeNorms/constants';

export interface JudgesListProps {
  toggleJudgesNorms: (item?: JudgeOverview) => void;
  onPageChange: (page: number) => void;
  data: JudgeOverview[];
  organizationUnitsList: any[];
  usersUnitsList: any[];
  total: number;
  onFilterChange: (value: any, name: string) => void;
  filters: JudgesListFilters;
  addNorm: () => void;
  loading: boolean;
}

const JudgesList: React.FC<JudgesListProps> = ({
  toggleJudgesNorms,
  onPageChange,
  data,
  organizationUnitsList,
  usersUnitsList,
  total,
  onFilterChange,
  filters,
  addNorm,
  loading,
}) => {
  const list: JudgeOverview[] = useMemo(
    () =>
      data?.map((item: JudgeOverview) => ({
        ...item,
        evaluation_title: item?.norms[0]?.evaluation?.score ? item?.norms[0]?.evaluation?.score : '',
        relocation_title: item?.norms[0]?.relocation?.location ? item?.norms[0]?.relocation?.location : '',
      })),
    [data],
  );

  return (
    <OverviewBox>
      <MainTitle variant="bodyMedium" content="PREGLED SUDIJA I PREDSJEDNIKA" />
      {/*TODO: theme color */}
      <Divider color="#615959" height="1px" />
      <Header>
        <Filters>
          <FilterDropdown
            label="ORGANIZACIONA JEDINICA:"
            options={organizationUnitsList as any}
            value={filters.organization_unit as any}
            name="organization_unit_id"
            onChange={value => onFilterChange(value, 'organization_unit')}
            placeholder="Odaberite organizacionu jedinicu"
          />
          <FilterDropdown
            label="SUDIJA:"
            options={usersUnitsList as any}
            value={filters.user_profile as any}
            name="user_profile_id"
            onChange={value => onFilterChange(value, 'user_profile')}
            placeholder="Odaberite sudiju"
            isSearchable
          />
        </Filters>
        <Controls>
          <Button content="Dodaj normu" variant="secondary" style={{width: 130}} onClick={() => addNorm()} />
        </Controls>
      </Header>
      <Table
        tableHeads={judgeTableHeads}
        data={list}
        style={{marginBottom: 22}}
        isLoading={loading}
        onRowClick={item => toggleJudgesNorms(item)}
      />
      <Pagination
        pageCount={Math.ceil(total / 10)}
        onChange={onPageChange}
        variant="filled"
        itemsPerPage={2}
        pageRangeDisplayed={3}
      />
    </OverviewBox>
  );
};

export default JudgesList;
