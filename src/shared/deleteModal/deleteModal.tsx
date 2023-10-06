import {Button, Modal, Typography} from 'client-library';
import React from 'react';
import {DeleteModalContent, DeleteModalControlButtons, TriangleIcon} from './styles';
import {DeleteModalProps} from './types';

const defaultMessage = 'Ovaj fajl ce biti trajno izbrisan iz sistema.';
const defaultQuestion = 'Da li ste sigurni ?';

export const DeleteModal: React.FC<DeleteModalProps> = ({
  open,
  onClose,
  handleDelete,
  customContent,
  message = defaultMessage,
  question = defaultQuestion,
}) => {
  const buttonControls = (
    <DeleteModalControlButtons>
      <Button content={'Obriši'} onClick={handleDelete} variant="primary" />
      <Button content={'Otkaži'} onClick={onClose} variant="secondary" />
    </DeleteModalControlButtons>
  );

  const defaultContent = (
    <DeleteModalContent>
      <TriangleIcon />
      <Typography content={question} variant="bodyLarge" style={{fontWeight: 600, marginBottom: 20}} />
      <Typography content={message} variant="bodyLarge" />
    </DeleteModalContent>
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
