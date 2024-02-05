import styled from 'styled-components';
import {Input} from 'client-library';

export const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 20px;
`;

export const Option = styled.div`
  max-width: 350px;
`;

export const RowWrapper = styled.div`
  display: flex;
`;

export const Column = styled.div`
  width: 350px;
  margin-right: 20px;
`;

export const ReasonForCertificateInput = styled(Input)`
  width: 720px;
`;
