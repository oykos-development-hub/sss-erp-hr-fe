import {Button, Divider, Pagination, Table} from 'client-library';
import React, {RefObject, useEffect, useMemo, useRef} from 'react';
import {judgeTableHeads} from '../../screens/judges/judgeNorms/constants';
import {JudgesListFilters} from '../../screens/judges/judgeNorms/judges';
import {Judge} from '../../types/graphql/judges';
import {scrollToTheNextElement} from '../../utils/scrollToTheNextElement';
import {Controls, FilterDropdown, Filters, Header, MainTitle, OverviewBox} from './styles';

export interface JudgesListProps {
  toggleJudgesNorms: (item?: Judge) => void;
  onPageChange: (page: number) => void;
  data: Judge[];
  organizationUnitsList: any[];
  usersUnitsList: any[];
  total: number;
  onFilterChange: (value: any, name: string) => void;
  filters: JudgesListFilters;
  addNorm: () => void;
  loading: boolean;
  parentRef: RefObject<HTMLDivElement>;
  createPermission: boolean;
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
  parentRef,
  createPermission,
}) => {
  const overviewRef = useRef<HTMLDivElement>(null);

  const list: Judge[] = useMemo(
    () =>
      data?.map((item: Judge) => ({
        ...item,
        evaluation_title: item?.norms[0]?.evaluation?.score ? item?.norms[0]?.evaluation?.score : '',
        relocation_title: item?.norms[0]?.relocation?.location ? item?.norms[0]?.relocation?.location : '',
      })),
    [data],
  );

  return (
    <OverviewBox ref={overviewRef}>
      <MainTitle variant="bodyMedium" content="PREGLED SUDIJA I PREDSJEDNIKA" />
      {/*TODO: theme color */}
      <Divider color="#615959" height="1px" />
      <Header>
        <Filters>
          <FilterDropdown
            label="ORGANIZACIONA JEDINICA:"
            options={organizationUnitsList}
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
        {createPermission && (
          <Controls>
            <Button content="Dodajte normu" variant="secondary" style={{width: 130}} onClick={() => addNorm()} />
          </Controls>
        )}
      </Header>
      <Table
        tableHeads={judgeTableHeads}
        data={list}
        style={{marginBottom: 22}}
        isLoading={loading}
        onRowClick={item => {
          toggleJudgesNorms(item);
          scrollToTheNextElement(parentRef, overviewRef);
        }}
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
