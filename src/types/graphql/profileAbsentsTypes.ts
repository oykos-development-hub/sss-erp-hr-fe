import {DropdownDataNumber} from '../dropdownData';

export type UserProfileAbsents = {
  id: number;
  user_profile_id: number;
  summary: SumaryTypes;
  vacation_type: VacationType;
  location: string;
  target_organization_unit: TargetOrganisationTypes;
  date_of_start: string;
  date_of_end: string;
  description: string;
  created_at: string;
  updated_at: string;
  file_id: number;
};

export type SumaryTypes = {
  current_available_days: number;
  past_available_days: number;
  used_days: number;
};

export type VacationType = {
  id: number;
  title: string;
};

export type TargetOrganisationTypes = {
  id: number;
  title: string;
};

export type UserProfileAbsentsParams = {
  id: number;
  user_profile_id: number;
  vacation_type: DropdownDataNumber | null;
  vacation_type_id: number;
  location: string;
  target_organization_unit_id: number;
  target_organization_unit: DropdownDataNumber | null;
  date_of_start: string;
  date_of_end: string;
  description: string;
  file_id: number;
};

export interface UserProfileAbsentsResponse {
  data: {
    userProfile_Absent: {
      status?: string;
      message?: string;
      items: UserProfileAbsents[];
      summary: SumaryTypes;
    };
  };
}
