import {EditIconTwo, Table, Theme, TrashIcon} from 'client-library';
import React, {useMemo} from 'react';
import {Norms} from '../../types/graphql/judges';
import {FilterDropdown, Filters, Header, OverviewBox} from '../judgesList/styles';
import {NormListFilters} from '../../screens/judges/judgeNorms/judges';
import {DropdownDataNumber} from '../../types/dropdownData';
import {judgeNormsTableHeads} from '../../screens/judges/judgeNorms/constants';

interface NormsListProps {
  data: Norms[];
  toggleNormsModal: (item: Norms) => void;
  handleDeleteIconClick: (id: number) => void;
  onFilterChange: (value: any, name: string) => void;
  filters: NormListFilters;
  areas: DropdownDataNumber[];
}

const NormsList: React.FC<NormsListProps> = ({
  data,
  filters,
  areas,
  onFilterChange,
  toggleNormsModal,
  handleDeleteIconClick,
}) => {
  const list: Norms[] = useMemo(() => {
    return data?.filter((item: Norms) => {
      if (filters.area === null || filters.area.id === 0) {
        return true;
      }
      return item?.topic?.title === filters.area.title;
    });
  }, [data, filters.area]);

  return (
    <OverviewBox>
      <Header>
        <Filters>
          <FilterDropdown
            label="MATERIJA:"
            options={areas}
            value={filters.area as any}
            name="topic"
            onChange={value => onFilterChange(value, 'area')}
            placeholder="Odaberite materiju"
          />
        </Filters>
      </Header>
      <Table
        tableHeads={judgeNormsTableHeads}
        data={list}
        style={{marginBottom: 22}}
        tableActions={[
          {
            name: 'edit',
            onClick: item => toggleNormsModal(item),
            icon: <EditIconTwo stroke={Theme?.palette?.gray800} />,
          },
          {
            name: 'delete',
            onClick: item => handleDeleteIconClick(item.id),
            icon: <TrashIcon stroke={Theme?.palette?.gray800} />,
          },
        ]}
      />
    </OverviewBox>
  );
};

export default NormsList;
