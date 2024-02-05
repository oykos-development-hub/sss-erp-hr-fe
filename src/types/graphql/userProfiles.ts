import {DropdownDataBoolean, DropdownDataNumber} from '../dropdownData';
import {PaginationProps} from '../paginationParams';

export interface UserProfileParams {
  page: number;
  size: number;
  id?: number;
  is_active?: boolean;
  organization_unit_id?: number;
  job_position_id?: number;
  name?: string;
}

export interface UserProfile {
  id: number;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  email: string;
  phone: string;
  active: boolean;
  is_judge: boolean;
  is_judge_president: boolean;
  role: DropdownDataNumber;
  organization_unit: DropdownDataNumber;
  job_position: DropdownDataNumber;
  department: DropdownDataNumber;
  created_at: string;
  updated_at: string;
}

export type UserProfileResponse = {
  userProfiles_Overview: {
    items: UserProfile[];
    message: string;
    status: string;
    total: number;
  };
};

export interface UserProfileOverviewParams extends PaginationProps {
  id?: number;
  name?: string;
  is_active?: DropdownDataBoolean | null;
  organization_unit_id?: DropdownDataNumber | null;
  job_position_id?: DropdownDataNumber | null;
  type?: DropdownDataNumber | null;
}
