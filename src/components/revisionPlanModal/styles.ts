import styled from 'styled-components';
import {Modal, Typography} from 'client-library';

export const RevisionModal = styled(Modal)``;

export const ModalForm = styled.form``;

export const ModalSection = styled.div`
  margin-bottom: 68px;
`;

export const ModalSectionTitle = styled(Typography)`
  margin-bottom: 30px;
  font-weight: 600;
`;

export const FormGroup = styled.div`
  margin-bottom: 20px;
`;

export const Row = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 20px;

  ${FormGroup} {
    width: 50%;
  }
`;

export const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
`;

export const CheckboxLabel = styled(Typography)`
  margin-left: 5px;
`;
