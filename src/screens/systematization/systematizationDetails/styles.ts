import styled from 'styled-components';

export const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
export const Row = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1.5em;
  margin-top: 1.5em;
  width: 100%;
`;

export const MainWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 1.5em;
`;

export const FileUploadWrapper = styled.div`
  display: flex;
  align-self: flex-start;
  flex-direction: column;
  gap: 0.25em;
  width: 50%;

  & > p {
    font-weight: 600;
    text-transform: uppercase;
  }

  & > div {
    box-sizing: border-box;
  }

  & > div > div {
    display: flex;
    justify-content: space-between;

    & div > p > p {
      font-weight: 600;
    }
  }

  > div > div > div {
    flex-direction: row-reverse;
  }
`;

export const UploadWrapper = styled.div`
  display: flex;
  margin-bottom: 1.5em;
  width: 100%;
  gap: 1.25em;
  & > div > div {
    width: 100%;
  }
`;
