import styled from 'styled-components';
import {Typography, Theme} from 'client-library';

export const Container = styled.div``;
export const InfoPreview = styled.div`
  display: flex;
  align-items: center;
`;

export const Details = styled.div`
  display: flex;
  gap: 20px;
  margin-block: 22px;
`;

export const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const StyledLabel = styled(Typography)`
  text-transform: uppercase;
  font-weight: bold;
  margin-right: 1rem;
`;

export const StyledValue = styled(Typography)``;

export const TitleAndButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;
