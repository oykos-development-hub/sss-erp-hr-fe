import styled from 'styled-components';

export const ModalContentWrapper = styled.form`
  display: flex;
  flex-direction: column;
`;

export const FormGroup  = styled.div`
 padding-bottom: 20px;
`;

export const FileUploadWrapper = styled.div`
 display: flex;
 align-items: center;
 width: 100%;

 > div > div {
 display: flex;
 justify-content: space-between;
 width: 80%;

  & div > p > p {
      font-weight: 600;
      line-height: 20px;
  }
 }
`;

export const UploadedFileWrapper = styled.div`
 margin-top: 20px;
`;

export const UploadedFileContainer = styled.div`
 padding-top: 20px;
 padding-inline: 10px;
`;
