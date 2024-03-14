import styled from 'styled-components';
import {Typography} from 'client-library';
import SectionBox from '../../shared/sectionBox';

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

export const Filters = styled.div`
  display: flex;
`;

export const FilterContainer = styled.div`
  width: 300px;
  margin-right: 20px;
`;

export const FileUploadWrapper = styled.div`
  max-width: 600px;
  display: flex;
  align-items: center;
  width: 100%;
  margin-block: 10px;
  margin-top: 20px;
`;
