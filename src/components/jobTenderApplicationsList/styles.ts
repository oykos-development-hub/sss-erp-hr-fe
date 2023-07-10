import {Theme} from 'client-library';
import styled from 'styled-components';

export const TableHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 31px 43px 31px 12px;
  background-color: ${Theme.palette.gray50};
`;

export const PlusButton = styled.div`
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  border: 1px solid ${Theme.palette.primary500};
  background-color: ${Theme.palette.white};
  cursor: pointer;
`;
