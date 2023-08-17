import {DropdownDataNumber} from '../dropdownData';
import {SystematizationJobPositions} from './jobPositions';

export interface SectorType {
  id: number;
  parent_id: number;
  title: string;
  abbreviation: string;
  color: string;
  icon: string;
  job_positions_organization_units: SystematizationJobPositions[];
}

export interface SystematizationDetails {
  id: number;
  userProfile: DropdownDataNumber;
  organizationUnit: DropdownDataNumber;
  description: string;
  serial_number: string;
  active: boolean;
  date_of_activation: string;
  created_at: string;
  updated_at: string;
  sectors: SectorType[];
}

export interface SystematizationsParams {
  page: number;
  size: number;
  id?: number;
  organization_unit_id?: number;
}

export interface SystematizationGetDetailsResponse {
  data: {
    systematization_Details: {
      status: string;
      message: string;
      item: SystematizationDetails;
    };
  };
}
