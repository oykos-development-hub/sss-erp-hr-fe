import styled from 'styled-components';
import {Typography, Theme} from 'client-library';

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
  width: 650px;
  display: flex;
`;

export const YearContainer = styled.div`
  width: 320px;
  margin-right: 8px;
`;

export const VacationWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 50px;
`;

export const VacationContainer = styled.div`
  width: 339px;
  height: 130px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 1px solid ${Theme.palette.gray600};
  border-radius: 8px;
  margin-right: 24px;

  &:last-child {
    margin-right: 0;
  }
`;

export const AlertWrapper = styled.div`
  position: fixed;
  bottom: 75px;
  right: 23px;
  width: 40%;
`;

export const SuperTitle = styled(Typography)`
  color: ${Theme.palette.gray600};
`;
export const Subtitle = styled(Typography)`
  color: ${Theme.palette.gray600};
  font-weight: 400;
  height: 20px;
`;

export const Title = styled(Typography)`
  font-weight: 600;
  color: ${Theme.palette.gray600};
`;

export const TableTitle = styled(Typography)`
  font-weight: 600;
  line-height: 24px;
  margin-top: 30px;
`;
