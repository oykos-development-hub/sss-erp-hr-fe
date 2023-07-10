import styled from 'styled-components';
import SectionBox from '../../shared/sectionBox';
import {Typography} from 'client-library';

export const RevisionListContainer = styled(SectionBox)`
  margin-top: 22px;
`;

export const MainTitle = styled(Typography)`
  margin-bottom: 10px;
  font-weight: 600;
`;

export const TableHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 34px;
  margin-bottom: 30px;
`;

export const FilterContainer = styled.div`
  width: 300px;
`;
