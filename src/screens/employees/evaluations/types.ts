import {Settings} from '../../../types/graphql/settings';
import {MicroserviceProps} from '../../../types/micro-service-props';

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
  userProfileId?: number;
  evaluationTypes: Settings[];
}
