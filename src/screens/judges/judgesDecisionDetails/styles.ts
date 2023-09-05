import styled from 'styled-components';
import {Table, Dropdown} from 'client-library';

export const FormFooter = styled.div`
  width: 100%;
  height: 114px;
  border-top: 1px solid #b27d1e;
  background-color: #fbf1f1;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 14px;
  box-sizing: border-box;
`;

export const Filters = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  position: sticky;
  height: 130px;
  top: -30px;
  z-index: 10;
  background-color: white;
`;

export const CustomDropdown = styled(Dropdown)`
  width: 300px;
`;

export const CustomTable = styled(Table)`
  background-color: white;
  margin-bottom: 22px;

  & th {
    position: sticky;
    top: 100px;
    z-index: 2;
    background-color: white;
  }

  & th::after {
    content: '';
    /* width */
    display: block;
    height: 1px;
    background-color: rgb(171, 162, 162);
    position: absolute;
    bottom: -1px;
    left: 0;
    right: 0;
  }
`;

export const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;
