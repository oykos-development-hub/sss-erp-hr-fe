import {EditIconTwo, Table, Theme, TrashIcon} from 'client-library';
import React, {useMemo, useState} from 'react';
import {FilterDropdown, Filters, Header, OverviewBox} from '../judgesList/styles';
import {DropdownDataString} from '../../types/dropdownData';
import {judgeNormsTableHeads} from '../../screens/judges/judgeNorms/constants';
import {topicOptions} from '../../screens/judges/constants';
import {JudgeNorm} from '../../types/graphql/judgeNorms';
import {getYearOptions} from '../../utils/constants';
import {JudgesListFilters} from '../../screens/judges/judgeNorms/judges';

interface NormsListProps {
  data: JudgeNorm[];
  toggleNormsModal: (item: JudgeNorm) => void;
  handleDeleteIconClick: (id: number) => void;
  loading: boolean;
  onFilterChange: (value: any, name: string) => void;
  filters: JudgesListFilters;
}

const NormsList: React.FC<NormsListProps> = ({
  data,
  toggleNormsModal,
  handleDeleteIconClick,
  loading,
  onFilterChange,
  filters,
}) => {
  const [topic, setTopic] = useState<DropdownDataString | null>(null);

  const onTopicChange = (value: any) => {
    if (value.id === 'Sve') {
      setTopic(null);
      return;
    }
    setTopic(value);
  };

  const list = useMemo(() => {
    const filteredData = topic ? data?.filter(norm => norm.topic === topic?.id) : data;
    return filteredData?.map(item => ({
      ...item,
      number_of_items: Number(item.title) - Number(item.title) * (Number(item.number_of_norm_decrease) / 100),
    }));
  }, [data, topic]);

  return (
    <OverviewBox>
      <Header>
        <FilterDropdown
          label="MATERIJA:"
          options={topicOptions}
          value={topic}
          name="topic"
          onChange={value => onTopicChange(value)}
          placeholder="Odaberite materiju"
        />

        <FilterDropdown
          label="GODINA:"
          options={getYearOptions(10, true, 2)}
          value={filters?.norm_year}
          name="norm_year_id"
          onChange={value => onFilterChange(value, 'norm_year')}
          placeholder="Odaberite godinu"
        />
      </Header>
      <Table
        tableHeads={judgeNormsTableHeads}
        data={list}
        style={{marginBottom: 22}}
        isLoading={loading}
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
