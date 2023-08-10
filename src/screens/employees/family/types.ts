import {MicroserviceProps} from '../../../types/micro-service-props';

export interface FamilyPageProps {
  data?: any[];
  context: MicroserviceProps;
}

export interface FamilyMemberModalProps {
  selectedItem?: any;
  open: boolean;
  onClose: () => void;
  countries?: any[];
  userProfileId?: number;
  alert: any;
  refetch: () => void;
}
