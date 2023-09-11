import {DropdownDataNumber} from '../../types/dropdownData';

export interface OrganizationUnitModalProps {
  selectedItem?: any;
  open: boolean;
  onClose: (refetch?: any, message?: any) => void;
  dropdownData?: any;
  action?: string;
  organizationUnit?: DropdownDataNumber;
  alert: any;
  refetch: () => void;
}
