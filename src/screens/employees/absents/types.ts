import {AbsenceType} from '../../../types/graphql/absents';

export interface AbsenceTypeModalProps {
  selectedItem?: any;
  absenceTypes: AbsenceType[];
  open: boolean;
  onClose: (action?: any) => void;
  userProfileId: number;
  alert: any;
}

export interface VacationModalProps {
  selectedItem?: any;
  absenceTypes?: AbsenceType[];
  open: boolean;
  onClose: (action?: any) => void;
  userProfileId: number;
  alert: any;
}
