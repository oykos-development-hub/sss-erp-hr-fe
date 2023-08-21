import {EditIconTwo, Table, Theme, TrashIcon} from 'client-library';
import React, {useMemo, useState} from 'react';
import {Norms} from '../../types/graphql/judges';
import {FilterDropdown, Filters, Header, OverviewBox} from '../judgesList/styles';
import {DropdownDataString} from '../../types/dropdownData';
import {judgeNormsTableHeads} from '../../screens/judges/judgeNorms/constants';
import {topicOptions} from '../../screens/judges/constants';

interface NormsListProps {
  data: Norms[];
  toggleNormsModal: (item: Norms) => void;
  handleDeleteIconClick: (id: number) => void;
}

const NormsList: React.FC<NormsListProps> = ({data, toggleNormsModal, handleDeleteIconClick}) => {
  const [topic, setTopic] = useState<DropdownDataString | null>(null);

  const onTopicChange = (value: any) => {
    if (value.id === 'Sve') {
      setTopic(null);
      return;
    }
    setTopic(value);
  };

  const list = useMemo(() => (topic ? data?.filter(norm => norm.topic === topic?.id) : data), [data, topic]);

  return (
    <OverviewBox>
      <Header>
        <Filters>
          <FilterDropdown
            label="MATERIJA:"
            options={topicOptions}
            value={topic}
            name="topic"
            onChange={value => onTopicChange(value)}
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
