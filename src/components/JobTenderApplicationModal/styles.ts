import styled from 'styled-components';
import {AlertTriangleIcon} from 'client-library';

export const ModalContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
  > div {
    width: 50%;
  }
`;

export const RowFullWidth = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
  > div {
    width: 100%;
  }
`;

export const ConfirmModalContent = styled.div`
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
export const ConfirmModalButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;
