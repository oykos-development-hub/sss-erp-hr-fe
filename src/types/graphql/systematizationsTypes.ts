import {DropdownDataNumber} from '../dropdownData';

export type SystematizationType = {
  id: number;
  userProfile: DropdownDataNumber;
  organizationUnit: DropdownDataNumber;
  description: string;
  serial_number: number | string;
  active: boolean;
  date_of_activation: string;
  created_at: string;
  updated_at: string;
};

export interface SystematizationsParams {
  page: number;
  size: number;
  id?: number;
  organization_unit_id?: number;
}

export interface SystematizationsResponse {
  data: {
    systematizations_Overview: {
      status: string;
      message: string;
      total: number;
      items: SystematizationType[];
    };
  };
}
