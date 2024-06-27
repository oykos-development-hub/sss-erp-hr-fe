import styled from 'styled-components';
import {Typography} from 'client-library';

export const StyledLabel = styled(Typography)`
  font-weight: bold;
  margin: 24px 0;
`;

export const ExistingFileWrapper = styled.div`
  display: flex;
  margin-bottom: 1rem;
  width: 100%;
  > div {
    display: flex;
    justify-content: center;
    > div {
      min-width: 250px;
      width: 100%;
    }
  }
`;
