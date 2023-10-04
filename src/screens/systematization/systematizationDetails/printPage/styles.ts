import styled from 'styled-components';
import {Theme} from 'client-library';

export const PrintPageWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

export const SectorTitle = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 3em;
`;

export const JobInfo = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 3em;
  border-bottom: 1px solid ${Theme?.palette?.gray100};
  padding-top: 1.5em;
  justify-content: space-between;
`;
