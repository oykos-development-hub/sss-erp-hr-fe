import React from 'react';
import {Container, StyledLabel} from './styles';
import {Typography} from 'client-library';

interface InfoPreviewProps {
  label: string;
  value: string;
}

const InfoPreview = ({label, value}: InfoPreviewProps) => {
  return (
    <Container>
      <StyledLabel variant="bodyMedium" content={label} />
      <Typography variant="bodyMedium" content={value} />
    </Container>
  );
};

export default InfoPreview;
