import styled from 'styled-components';

export const FormWrapper = styled.form`
  display: flex;
  flex-direction: column;

  & * {
    font-family: 'Source Sans Pro', sans-serif;
  }
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
  max-width: 600px;
  display: flex;
  align-items: center;
  width: 100%;
  margin-block: 10px;
`;
