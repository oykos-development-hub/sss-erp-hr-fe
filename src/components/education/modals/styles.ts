import styled from 'styled-components';

export const ModalContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: auto;
  width: 600px;
`;

export const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
`;

export const FileUploadWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
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

export const FormGroup = styled.div`
  margin-bottom: 20px;
`;
