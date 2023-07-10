import styled from 'styled-components';
import {Theme, Table} from 'client-library';

export const EducationContainer = styled.div`
  padding: 20px 30px 0px 30px;
  display: grid;
  overflow-y: auto;
  height: calc(100vh - 320px);
`;

export const TableContainer = styled(Table)`
  padding-bottom: 22px;
`;

export const AlertWrapper = styled.div`
  position: fixed;
  bottom: 75px;
  right: 23px;
  width: 40%;
`;
