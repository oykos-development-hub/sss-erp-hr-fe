import styled from 'styled-components';
import {Theme, Table} from 'client-library';

export const StyledTable = styled(Table)`
  & tbody {
    vertical-align: top;

    tr {
      background-color: ${Theme?.palette?.white} !important;
      height: 270px;
      cursor: default;

      svg {
        cursor: pointer;
      }
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

export const EmployeeItem = styled.div<{disabled?: boolean}>`
  padding: 0.625em 0.875rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid ${({disabled}) => (disabled ? Theme.palette.gray300 : Theme.palette.gray400)};
  border-radius: 8px;

  & > p {
    color: ${({disabled}) => (disabled ? Theme.palette.gray300 : Theme.palette.gray400)};
  }
`;

export const EmployeeList = styled.div`
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;
