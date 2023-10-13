import {DropdownDataNumber} from '../dropdownData';

export interface UserProfileGetSalaryParams {
  id: number;
  user_profile?: DropdownDataNumber;
  benefited_track: boolean;
  organization_unit?: DropdownDataNumber;
  without_raise: boolean;
  insurance_basis: string;
  salary_rank: string;
  weekly_work_hours: string;
  education_rank: string;
  education_naming: string;
  obligation_reduction: string;
  resolution?: SalaryParamsResolution;
}

export interface UserProfileSalaryParams {
  id: number | null;
  user_profile_id: number;
  organization_unit_id: number;
  benefited_track: boolean;
  without_raise: boolean;
  insurance_basis: string;
  salary_rank: string;
  daily_work_hours: string;
  weekly_work_hours: string;
  education_rank: string;
  education_naming: string;
  user_resolution_id: number;
}

export interface SalaryParamsResolution {
  id: number;
  user_profile: DropdownDataNumber;
  resolution_type: DropdownDataNumber;
  resolution_purpose: string;
  date_of_start: string;
  date_of_end: string;
  file_id: number;
}

export interface UserProfileGetSalaryParamsResponse {
  data: {
    userProfile_SalaryParams: {
      status?: string;
      message?: string;
      items?: UserProfileGetSalaryParams[];
    };
  };
}
