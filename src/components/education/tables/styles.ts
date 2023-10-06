import styled from 'styled-components';
import {Theme, Table, Typography} from 'client-library';

export const EducationContainer = styled.div`
  padding: 20px 30px 0px 30px;
  display: grid;
  overflow-y: auto;
  height: calc(100vh - 320px);
`;

export const TableContainer = styled(Table)`
  padding-bottom: 22px;
`;

export const TableTitle = styled.div`
  height: 86px;
  background-color: ${Theme?.palette?.gray50};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-left: 12px !important;
  padding-right: 20px !important;
`;

export const AddIcon = styled.div`
  border: 1px solid ${Theme?.palette?.primary500};
  border-radius: 8px;
  height: 48px;
  width: 48px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  background-color: ${Theme?.palette?.white};
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: ${Theme?.palette?.primary500};

    > svg path {
      transition: stroke 0.2s ease-in-out;
      stroke: ${Theme?.palette?.white};
    }
  }
`;

export const TableTitleTypography = styled(Typography)`
  color: ${Theme?.palette?.gray600};
  font-weight: 600;
`;
