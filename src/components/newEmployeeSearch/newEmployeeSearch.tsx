import {Divider, Dropdown, Theme, Typography} from 'client-library';
import React from 'react';
import SectionBox from '../../shared/sectionBox';
import {ValueType} from 'client-library/dist/components/dropdown/types';

interface NewEmployeeSearchProps {
  onSearch: (value: ValueType, name: string) => void;
}

const NewEmployeeSearch: React.FC<NewEmployeeSearchProps> = ({onSearch}) => {
  return (
    <SectionBox style={{marginTop: 20}}>
      <Typography variant="bodyMedium" style={{fontWeight: 600}} content="DODATI NOVOG ZAPOSLENOG" />
      <Divider height="1px" width="100%" color={Theme.palette.gray600} style={{marginBottom: 22}} />
      <Dropdown label="JMBG" isSearchable={true} onChange={onSearch} options={[]} name={'jmbg'} />
    </SectionBox>
  );
};

export default NewEmployeeSearch;
