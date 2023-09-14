import {DropdownDataNumber} from '../dropdownData';

export type UserProfileAbsents = {
  id: number;
  user_profile_id: number;
  summary: SumaryTypes;
  absent_type: VacationType;
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
  accounting_days_off: boolean;
};

export type TargetOrganisationTypes = {
  id: number;
  title: string;
};

export type UserProfileAbsentsParams = {
  id: number | null;
  user_profile_id: number;
  absent_type_id: DropdownDataNumber | null;
  target_organization_unit_id: DropdownDataNumber | null;
  date_of_start: string | null;
  date_of_end: string | null;
  description: string;
  file_id: number | null;
  absent_type?: {
    id: number;
    title: string;
    accounting_days_off: boolean;
  };
  target_organization_unit?: {
    id: number;
    title: string;
  };
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

export interface AbsentType {
  id: number;
  title: string;
  abbreviation: string;
  accounting_days_off: boolean;
  description: string;
  color: string;
  icon: string;
}

export interface AbsentTypeResponse {
  data: {
    absentType: {
      status?: string;
      message?: string;
      total?: number;
      items: AbsentType[];
    };
  };
}
