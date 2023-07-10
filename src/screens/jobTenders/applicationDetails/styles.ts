import styled from 'styled-components';
import {Theme} from 'client-library';

export const Details = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-block: 22px;
`;

export const Row = styled.div`
  display: flex;
  gap: 12px;
`;

export const TableHeader = styled.div`
  background-color: ${Theme.palette.gray50};
  padding: 32px 12px;
  border-radius: 8px;
`;
