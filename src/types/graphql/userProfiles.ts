import {DropdownDataBoolean, DropdownDataNumber, DropdownDataString} from '../dropdownData';

export interface UserProfileBasicInfo {
  id: number;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  birth_last_name: string;
  country_of_birth: string;
  city_of_birth: string;
  nationality: string;
  citizenship: string;
  address: string;
  father_name: string;
  mother_name: string;
  mother_birth_last_name: string;
  bank_account: string;
  bank_name: string;
  official_personal_id: string;
  official_personal_document_number: string;
  official_personal_document_issuer: string;
  gender: string;
  single_parent: boolean;
  housing_done: boolean;
  housing_description: string;
  is_president: boolean;
  marital_status: string;
  date_of_taking_oath: string;
  date_of_becoming_judge: string;
  email: string;
  phone: string;
  organization_unit: DropdownDataNumber;
  job_position: DropdownDataNumber;
  contract: UserContract;
  national_minority: string;
  personal_id: string;
}

export interface UserProfileBasicInfoFormValues {
  id: number;
  first_name: string;
  last_name: string;
  date_of_birth: Date | null;
  birth_last_name: string;
  country_of_birth: string;
  city_of_birth: string;
  nationality: DropdownDataString | null;
  citizenship: DropdownDataString | null;
  address: string;
  father_name: string;
  mother_name: string;
  mother_birth_last_name: string;
  official_personal_id: string;
  official_personal_document_number: string;
  official_personal_document_issuer: DropdownDataString | null;
  gender: DropdownDataString | null;
  single_parent: DropdownDataString | null;
  housing_done: DropdownDataString | null;
  revisor_role: boolean;
  housing_description: string;
  marital_status: DropdownDataString | null;
  date_of_becoming_judge: Date | null;
  email: string;
  phone: string;
  national_minority: DropdownDataString | null;
  secondary_email: string;
  pin: string;
  password: string;
  middle_name: string;
  role_id: number;
  contract: BasicInfoUserContractValues;
  personal_id: string;
}

export interface UserContract {
  id: number;
  user_profile: DropdownDataNumber | null;
  contract_type: DropdownDataNumber | null;
  job_position_in_organization_unit: DropdownDataNumber | null;
  organization_unit: DropdownDataNumber | null;
  department: DropdownDataNumber | null;
  abbreviation: string;
  description: string;
  active: boolean;
  serial_number: string;
  net_salary: string;
  gross_salary: string;
  bank_account: string;
  bank_name: string;
  date_of_eligibility: string;
  date_of_start: string;
  date_of_end: string;
  file_id: number;
}

export interface BasicInfoUserContractValues {
  contract_type_id: DropdownDataNumber | null;
  organization_unit_id: DropdownDataNumber | null;
  department_id: DropdownDataNumber | null;
  date_of_start: Date | null;
  date_of_end: Date | null;
  date_of_eligibility: Date | null;
  file_id: number | null;
  job_position_in_organization_unit_id: DropdownDataNumber | null;
  user_profile_id: DropdownDataNumber | null;
  active: boolean;
}

export interface ContractType {
  abbreviation: string;
  color: string;
  created_at: string;
  description: string;
  icon: string;
  id: number;
  title: string;
  updated_at: string;
}

export interface UserProfileBasicResponse {
  data: {
    userProfile_Basic: {
      status?: string;
      message?: string;
      item?: UserProfileBasicInfo;
    };
  };
}

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
  created_at: string;
  updated_at: string;
}

export interface UserProfileResponse {
  items: UserProfile[];
  message: string;
  status: string;
  total: number;
}
