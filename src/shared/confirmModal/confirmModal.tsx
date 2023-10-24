import {Button, Modal, Typography} from 'client-library';
import React from 'react';
import {ConfirmModalButtons, ConfirmModalContent, TriangleIcon} from './styles';
import {ConfirmModalProps} from './types';

const defaultMessage = 'Ovaj fajl ce biti trajno izbrisan iz sistema.';
const defaultQuestion = 'Da li ste sigurni ?';

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  open,
  onClose,
  handleConfirm,
  customContent,
  message = defaultMessage,
  question = defaultQuestion,
  confirmText = 'Obriši',
  cancelText = 'Otkaži',
}) => {
  const buttonControls = (
    <ConfirmModalButtons>
      <Button content={confirmText} onClick={handleConfirm} variant="primary" />
      <Button content={cancelText} onClick={onClose} variant="secondary" />
    </ConfirmModalButtons>
  );

  const defaultContent = (
    <ConfirmModalContent>
      <TriangleIcon />
      <Typography content={question} variant="bodyLarge" style={{fontWeight: 600, marginBottom: 20}} />
      <Typography content={message} variant="bodyLarge" />
    </ConfirmModalContent>
  );

  return (
    <Modal
      open={open}
      onClose={() => {
        onClose(true);
      }}
      width={450}
      leftButtonText="Obriši"
      rightButtonText="Otkaži"
      content={customContent ? customContent : defaultContent}
      customButtonsControls={buttonControls}
    />
  );
};
