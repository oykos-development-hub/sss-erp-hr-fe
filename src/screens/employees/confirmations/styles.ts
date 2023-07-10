import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 20px;
  & > span {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 10px;
  }
`;

export const TableHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const EditWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 50%;
`;

export const YearWrapper = styled.div`
  width: 320px;
`;

export const AlertWrapper = styled.div`
  position: fixed;
  bottom: 75px;
  right: 23px;
  width: 40%;
`;
