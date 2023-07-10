import {MicroserviceProps} from '../../../types/micro-service-props';

export interface EvaluationPageProps {
  context: MicroserviceProps;
}

export type YearType = {
  id: number | string;
  title: string;
};

export interface EvaluationModalProps {
  alert: any;
  refetchList: () => void;
  selectedItem?: any;
  open: boolean;
  onClose: (refetch?: any, message?: any) => void;
  years: YearType[];
  userProfileId?: number;
}
