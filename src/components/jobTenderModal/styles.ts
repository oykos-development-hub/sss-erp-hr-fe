import styled from 'styled-components';

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
    width: 250px;
  }
`;

export const FileUploadWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  > div > div {
    display: flex;
    justify-content: space-between;
    width: 100%;
    & div > p > p {
      font-weight: 600;
    }
  }
`;
