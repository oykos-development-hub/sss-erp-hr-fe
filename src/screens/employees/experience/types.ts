import {MicroserviceProps} from '../../../types/micro-service-props';

export interface ExperiencePageProps {
  data?: any[];
  context: MicroserviceProps;
}

export type UnitType = {
  id: number;
  title: string;
};

export interface ExperienceModalProps {
  alert: any;
  refetchList: () => void;
  selectedItem?: any;
  open: boolean;
  onClose: (refetch?: any, message?: any) => void;
  units: UnitType[];
  userProfileId?: number;
}
