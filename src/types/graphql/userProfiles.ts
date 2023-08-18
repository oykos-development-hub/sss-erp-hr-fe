import {DropdownDataNumber, DropdownDataString} from '../dropdownData';

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
  revisor_role: boolean;
  marital_status: string;
  date_of_taking_oath: string;
  date_of_becoming_judge: string;
  email: string;
  phone: string;
  organization_unit: DropdownDataNumber;
  job_position: DropdownDataNumber;
  contracts: UserContract[];
}

export interface UserProfileBasicInfoFormValues {
  id: number;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  birth_last_name: string;
  country_of_birth: string;
  city_of_birth: DropdownDataString | null;
  nationality: DropdownDataString | null;
  citizenship: DropdownDataString | null;
  address: string;
  father_name: string;
  mother_name: string;
  mother_birth_last_name: string;
  official_personal_id: string;
  official_personal_document_number: string;
  official_personal_document_issuer: string;
  gender: DropdownDataString | null;
  single_parent: boolean;
  housing_done: boolean;
  revisor_role: boolean;
  housing_description: string;
  marital_status: string;
  date_of_becoming_judge: string;
  email: string;
  phone: string;
  national_minority: DropdownDataString | null;
  secondary_email: string;
  pin: string;
  password: string;
  middle_name: string;
  role_id: number;
  contract: BasicInfoUserContractValues;
}

export interface UserContract {
  id: number;
  user_profile_id: number;
  contract_type_id: number;
  abbreviation: string;
  description: string;
  active: boolean;
  serial_number: string;
  net_salary: string;
  gross_salary: string;
  bank_account: string;
  bank_name: string;
  date_of_signature: string;
  date_of_eligibility: string;
  date_of_start: string;
  date_of_end: string;
  file_id: number;
  contract_type: ContractType | null;
}

export interface BasicInfoUserContractValues {
  contract_type_id: DropdownDataNumber | null;
  organization_unit_id: DropdownDataNumber | null;
  department_id: DropdownDataNumber | null;
  date_of_start: string;
  date_of_end: string;
  date_of_eligibility: string;
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
