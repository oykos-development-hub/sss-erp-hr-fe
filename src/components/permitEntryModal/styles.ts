import styled from 'styled-components';
import {Typography, Modal} from 'client-library';

export const PermitModal = styled(Modal)``;

export const Form = styled.form`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 20px;
`;

export const ColumnTitle = styled(Typography)`
  margin-bottom: 20px;
`;

export const FormColumn = styled.div`
  display: flex;
  flex-direction: column;
`;

export const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
`;

export const CheckboxLabel = styled(Typography)`
  margin-left: 5px;
`;

export const FormGroup = styled.div`
  margin-bottom: 20px;
`;
