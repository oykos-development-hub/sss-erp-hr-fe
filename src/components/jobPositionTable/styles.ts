import styled from 'styled-components';
import {Theme, Table} from 'client-library';

export const StyledTable = styled(Table)`
  & tbody {
    vertical-align: top;

    tr {
      background-color: ${Theme?.palette?.white} !important;
      height: 270px;
    }

    td input {
      width: 100% !important;
    }

    td:nth-child(2),
    td:nth-child(4) {
      width: 30%;
      min-width: 200px;
      & div,
      & input {
        height: 200px;
      }
    }
    td:nth-child(1),
    td:nth-child(5) {
      min-width: 200px;
    }
    td:nth-child(3) {
      min-width: 150px;
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
