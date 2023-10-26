import {MicroserviceProps} from '../../../types/micro-service-props';

export interface ExperiencePageProps {
  data?: any[];
  context: MicroserviceProps;
}

export interface ExperienceModalProps {
  alert: any;
  refetchList: () => void;
  selectedItem?: any;
  open: boolean;
  onClose: (refetch?: any, message?: string) => void;
  userProfileId?: number;
}
