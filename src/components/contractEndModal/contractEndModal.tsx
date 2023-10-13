import {Modal} from 'client-library';
import React from 'react';
import {ContractEndModalContent, CustomText, TriangleIcon} from './styles';
import useTerminateEmployment from '../../services/graphql/terminateEmployment/useTerminateEmployment';
import {MicroserviceProps} from '../../types/micro-service-props';

interface ContractEndProps {
  open: boolean;
  onClose: (action?: any) => void;
  profileId: number;
  context: MicroserviceProps;
}
export const ContractEndModal: React.FC<ContractEndProps> = ({open, onClose, profileId, context}) => {
  const {refetch} = useTerminateEmployment(profileId);

  const handleTerminateEmployment = () => {
    refetch();
    onClose(true);
    context.navigation.navigate(`/hr/employees/details/${profileId}/experience`);
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
