import {Dropdown, Input} from 'client-library';
import styled from 'styled-components';

export const FilterWrapper = styled.div`
  display: flex;
  flex: 1;
  gap: 8px;
  padding: 2rem 0;
  align-items: flex-end;
  flex-wrap: wrap;
`;

export const FilterDropdown = styled(Dropdown)`
  width: 300px;
`;

export const FilterInput = styled(Input)`
  width: 300px;
`;
