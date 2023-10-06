import {DropdownDataNumber} from '../../types/dropdownData';

export interface OrganizationUnitModalProps {
  selectedItem?: any;
  open: boolean;
  onClose: () => void;
  dropdownData?: any;
  action?: string;
  organizationUnit?: DropdownDataNumber;
  refetch: () => void;
}
