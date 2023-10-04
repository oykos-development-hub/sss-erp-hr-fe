import {DropdownDataNumber} from '../dropdownData';
import {DeleteResponse, DetailsResponse, GetResponse, InsertResponse} from './response';

export type SystematizationType = {
  id: number;
  ser_profile: DropdownDataNumber;
  organization_unit: DropdownDataNumber;
  description: string;
  serial_number: number | string;
  active: number;
  date_of_activation: string;
  created_at: string;
  updated_at: string;
};

export type SectorJobPosition = {
  available_slots: number;
  description: string;
  employees: any[];
  id: number;
  job_positions: DropdownDataNumber;
  requirements: string;
  serial_number: string;
};

export type SectorType = {
  abbreviation: string;
  color: string;
  icon: string;
  id: number;
  job_positions_organization_units: SectorJobPosition[];
  parent_id: number;
  title: string;
};

export type ActiveEmployee = {
  id: number;
  full_name: string;
  job_position: DropdownDataNumber;
  sector: string;
};

export type SystematizationDetails = SystematizationType & {
  sectors: SectorType[];
  active_employees: ActiveEmployee[];
};

export type GetSystematizationsParams = {
  page: number;
  size: number;
  id?: number;
  organization_unit_id?: number;
  year: string;
  search: string;
};

export type InsertSystematizationParams = {
  id: number;
  user_profile_id: number;
  organization_unit_id: number;
  description: string;
  serial_number: string;
  active: number;
  date_of_activation: string;
  file_id: number;
};

export interface SystematizationsResponse {
  get: {
    systematizations_Overview: GetResponse<SystematizationType>;
  };
  details: {
    systematization_Details: DetailsResponse<SystematizationDetails>;
  };
  insert: {
    systematizations_Insert: InsertResponse<SystematizationType>;
  };
  delete: {
    systematizations_Delete: DeleteResponse;
  };
}
