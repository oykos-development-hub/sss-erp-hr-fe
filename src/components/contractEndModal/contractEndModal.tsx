import {Modal} from 'client-library';
import React from 'react';
import useAppContext from '../../context/useAppContext';
import useTerminateEmployment from '../../services/graphql/terminateEmployment/useTerminateEmployment';
import {ContractEndModalContent, CustomText, TriangleIcon} from './styles';

interface ContractEndModalProps {
  open: boolean;
  onClose: (action?: any) => void;
  profileId: number;
}

export const ContractEndModal: React.FC<ContractEndModalProps> = ({open, onClose, profileId}) => {
  const {terminateEmployment} = useTerminateEmployment();

  const {navigation, alert} = useAppContext();

  const handleTerminateEmployment = () => {
    terminateEmployment(
      profileId,
      () => {
        onClose(true);
        alert.success('Radni odnos je uspješno prekinut.');
        navigation.navigate(`/hr/employees/details/${profileId}/experience`);
      },
      () => {
        alert.error('Došlo je do greške prilikom prekida radnog odnosa.');
      },
    );
  };

  return (
    <Modal
      open={open}
      onClose={() => {
        onClose(true);
      }}
      width={450}
      leftButtonText="Prekini radni odnos"
      rightButtonText="Odustani"
      leftButtonOnClick={() => handleTerminateEmployment()}
      rightButtonOnClick={onClose}
      content={
        <ContractEndModalContent>
          <TriangleIcon />
          <CustomText content="Da li ste sigurni da želite prekinuti radni odnos zaposlenom?" variant="bodyLarge" />
        </ContractEndModalContent>
      }
    />
  );
};
