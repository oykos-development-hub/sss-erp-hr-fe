import styled from 'styled-components';
import {Theme, Table} from 'client-library';

export const StyledTable = styled(Table)`
  & tbody {
    vertical-align: top;

    tr {
      background-color: ${Theme?.palette?.white}!important;
      height: 270px;
    }
  }
`;

export const EmployeeDropdownWrapper = styled.div`
  display: flex;
  align-items: center;
  & svg {
    margin-left: 8px;
  }
`;
