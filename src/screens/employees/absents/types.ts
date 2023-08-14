import {AbsentType} from '../../../types/graphql/profileAbsentsTypes';

export interface AbsentsModalProps {
  selectedItem?: any;
  absentTypes: AbsentType[];
  open: boolean;
  onClose: (action?: any) => void;
  userProfileId: number;
  alert: any;
}
