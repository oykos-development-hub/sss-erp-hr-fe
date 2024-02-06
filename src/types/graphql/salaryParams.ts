import {DropdownDataBoolean, DropdownDataNumber, DropdownDataString} from '../dropdownData';
import {FileItem} from '../fileUploadType';
import {GetResponse, InsertResponse} from './response';

export interface ProfileSalaryParams {
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
  created_at: string;
}

export interface ProfileSalaryInsertParams {
  id: number | null;
  user_profile_id: number;
  organization_unit_id: number;
  benefited_track: boolean;
  without_raise: boolean;
  insurance_basis: string;
  salary_rank: string;
  // daily_work_hours: string;
  weekly_work_hours: string;
  education_rank: string;
  education_naming: string;
  obligation_reduction: string;
}

export interface SalaryParamsResolution {
  id: number;
  user_profile: DropdownDataNumber;
  resolution_type: DropdownDataNumber;
  resolution_purpose: string;
  date_of_start: string;
  date_of_end: string;
  file: FileItem;
}

// This type includes some properties coming from different API endpoints
export type ProfileSalaryFormValues = {
  id: number | null;
  benefited_track: DropdownDataString | null;
  without_raise: DropdownDataBoolean | null;
  insurance_basis: DropdownDataString | null;
  salary_rank: DropdownDataString | null;
  obligation_reduction: DropdownDataString | null;
  weekly_work_hours: DropdownDataString | null;
  education_rank: string;
  education_naming: string;
  user_profile_id: number;
  // Properties not coming from the SalaryParams API
  job_position: DropdownDataNumber | null;
  organization_unit: DropdownDataNumber | null;
  education_level: string;
  date_of_start: Date | null;
  contract_type: DropdownDataNumber | null;
};

export type ProfileSalaryParamsResponse = {
  get: {
    userProfile_SalaryParams: GetResponse<ProfileSalaryParams>;
  };
  insert: {
    userProfile_SalaryParams_Insert: InsertResponse<ProfileSalaryParams>;
  };
};
