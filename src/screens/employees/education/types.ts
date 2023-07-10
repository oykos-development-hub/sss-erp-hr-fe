import {ReactElement} from 'react';
import {MicroserviceProps} from '../../../types/micro-service-props';

export interface EducationPageProps {
  data?: any[];
  context: MicroserviceProps;
}

export interface ModalProps {
  selectedItem?: any;
  alert?: any;
  open: boolean;
  onClose: () => void;
  dropdownData?: any[];
  handleDelete?: (action?: any) => void;
  customContent?: ReactElement;
  refetchList?: () => void;
}

export interface TableProps {
  languages?: any[];
  alert?: any;
}
