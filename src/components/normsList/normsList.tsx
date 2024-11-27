import {EditIconTwo, Table, Theme, TrashIcon, TableAction} from 'client-library';
import React, {useMemo, useState} from 'react';
import {FilterDropdown, Filters, Header, OverviewBox} from '../judgesList/styles';
import {DropdownDataString} from '../../types/dropdownData';
import {judgeNormsTableHeads} from '../../screens/judges/judgeNorms/constants';
import {topicOptions} from '../../screens/judges/constants';
import {JudgeNorm} from '../../types/graphql/judgeNorms';
import {getYearOptions} from '../../utils/constants';

interface NormsListProps {
  data: JudgeNorm[];
  toggleNormsModal: (item: JudgeNorm) => void;
  handleDeleteIconClick: (id: number) => void;
  loading: boolean;
  updatePermission: boolean;
  deletePermission: boolean;
  onFilterChange: (value: any, name: string) => void;
}

const NormsList: React.FC<NormsListProps> = ({
  data,
  toggleNormsModal,
  handleDeleteIconClick,
  loading,
  updatePermission,
  deletePermission,
}) => {
  const [topic, setTopic] = useState<DropdownDataString | null>(null);
  const [targetYear, setTargetYear] = useState<number>(0);

  const years =  getYearOptions(7, 2, true);

  const filteredList = useMemo(() => {
    if (!data) return [];

    return data
      .filter(norm => {
        const startYear = new Date(norm.norm_start_date).getFullYear();
        const endYear = new Date(norm.norm_end_date).getFullYear();
        return !targetYear || startYear === targetYear || endYear === targetYear;
      })
      .filter(norm => !topic || norm.topic === topic.id)
      .map(item => ({
        ...item,
        number_of_items: Number(item.title) * (1 - Number(item.number_of_norm_decrease) / 100),
      }));
  }, [data, topic, targetYear]);

  const actionItems = useMemo(
    () => [
      updatePermission && {
        name: 'edit',
        onClick: (item: JudgeNorm) => toggleNormsModal(item),
        icon: <EditIconTwo stroke={Theme?.palette?.gray800} />,
      },
      deletePermission && {
        name: 'delete',
        onClick: (item: JudgeNorm) => handleDeleteIconClick(item.id),
        icon: <TrashIcon stroke={Theme?.palette?.gray800} />,
      },
    ].filter(Boolean) as TableAction[],
    [deletePermission, updatePermission, toggleNormsModal, handleDeleteIconClick]
  );

  return (
    <OverviewBox>
      <Header>
        <FilterDropdown
          label="MATERIJA:"
          options={topicOptions}
          value={topic}
          name="topic"
          onChange={value => setTopic(value.id === '' ? null : value as DropdownDataString)}
          placeholder="Odaberite materiju"
        />

        <FilterDropdown
          label="GODINA:"
          options={years}
          name="norm_year_id"
          value={years.find(year => year.id === targetYear)}
          onChange={value => setTargetYear(value.id)}
          placeholder="Odaberite godinu"
        />
      </Header>
      <Table
        tableHeads={judgeNormsTableHeads}
        data={filteredList}
        style={{marginBottom: 22}}
        isLoading={loading}
        tableActions={actionItems}
      />
    </OverviewBox>
  );
};

export default NormsList;
