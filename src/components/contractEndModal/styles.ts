import styled from 'styled-components';
import {AlertTriangleIcon, Typography} from 'client-library';

export const ContractEndModalContent = styled.div`
  display: flex;
  flex-direction: column;
  height: auto;
  align-items: center;
  > div {
    padding-top: 5px;
  }
`;
export const TriangleIcon = styled(AlertTriangleIcon)`
  padding-bottom: 13px;
  width: 40px;
  height: 40px;
`;
export const ContractEndControlButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const CustomText = styled(Typography)`
  text-align: center;
`;
