import React, {useMemo, useState} from 'react';
import {Controls, FilterDropdown, Filters, Header, MainTitle, OverviewBox} from '../judgesList/styles';
import {JudgeResolutionOverview} from '../../types/graphql/judges';
import {DropdownDataString} from '../../types/dropdownData';
import {JudgesNumberListFilters} from '../../screens/judges/judgesNumberDecisions/judgesNumberDecision';
import {judgesNumberResolutionTableHeads} from '../../screens/judges/judgeNorms/constants';
import {EditIconTwo, Theme, TrashIcon, Button, Divider, Pagination, Table} from 'client-library';
import {DeleteModal} from '../../shared/deleteModal/deleteModal';
import useJudgeResolutionsDelete from '../../services/graphql/judges/useJudgeResolutionDelete';

export interface JudgesNumbersListProps {
  data: JudgeResolutionOverview[];
  total: number;
  years: DropdownDataString[];
  filters: JudgesNumberListFilters;
  onFilterChange: (value: any, name: string) => void;
  onPageChange: (page: number) => void;
  navigate: (path: string) => void;
  alert: any;
  refetch: () => void;
}

const JudgesNumbersList: React.FC<JudgesNumbersListProps> = ({
  data,
  total,
  years,
  filters,
  onFilterChange,
  onPageChange,
  navigate,
  alert,
  refetch,
}) => {
  const [deleteId, setDeleteId] = useState(0);
  const [deleteModal, setDeleteModal] = useState(false);

  const {mutate} = useJudgeResolutionsDelete();

  const list: JudgeResolutionOverview[] = useMemo(
    () =>
      data?.map((item: JudgeResolutionOverview) => ({
        ...item,
      })),
    [data],
  );

  const openDeleteModal = (id: number) => {
    setDeleteId(id);
    setDeleteModal(true);
  };

  const handleDelete = () => {
    if (deleteId) {
      mutate(
        deleteId,
        () => {
          refetch();
          alert.success('Uspješno obrisano.');
          setDeleteModal(false);
        },
        () => {
          alert.error('Greška. Brisanje nije moguće.');
          setDeleteModal(false);
        },
      );
    }
  };

  return (
    <OverviewBox>
      <MainTitle variant="bodyMedium" content="PREGLED ODLUKA O BROJU SUDIJA I PREDSJEDNIKA" />
      <Divider color="#615959" height="1px" />
      <Header>
        <Filters>
          <FilterDropdown
            label="GODINA:"
            options={years}
            value={filters.year as any}
            name="year"
            onChange={value => onFilterChange(value, 'year')}
            placeholder="Odaberite godinu"
          />
        </Filters>
        <Controls>
          <Button
            content="Dodaj odluku"
            variant="secondary"
            style={{width: 130}}
            onClick={() => navigate('/hr/judges/number-decision/new-decision')}
          />
        </Controls>
      </Header>
      <Table
        tableHeads={judgesNumberResolutionTableHeads}
        data={list}
        style={{marginBottom: 22}}
        tableActions={[
          {
            name: 'edit',
            onClick: row => navigate(`/hr/judges/number-decision/${row.id}`),
            icon: <EditIconTwo stroke={Theme?.palette?.gray800} />,
          },
          {
            name: 'delete',
            onClick: item => openDeleteModal(item.id),
            icon: <TrashIcon stroke={Theme?.palette?.gray800} />,
          },
        ]}
      />
      <Pagination
        pageCount={Math.ceil(total / 10)}
        onChange={onPageChange}
        variant="filled"
        itemsPerPage={2}
        previousLabel="Previous"
        nextLabel="Next"
        pageRangeDisplayed={3}
      />
      <DeleteModal open={deleteModal} onClose={() => setDeleteModal(false)} handleDelete={handleDelete} />
    </OverviewBox>
  );
};

export default JudgesNumbersList;
