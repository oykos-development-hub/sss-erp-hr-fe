import {DropdownDataNumber} from '../dropdownData';

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
  revisor_role: boolean;
  housing_description: string;
  marital_status: string;
  date_of_taking_oath: string;
  date_of_becoming_judge: string;
  email: string;
  phone: string;
  national_minority: string;
  secondary_email: string;
  pin: string;
  password: string;
  middle_name: string;
  position_in_organization_unit_id: number;
  role_id: number;
  contracts: UserContractItem[];
}

export interface UserContract {
  abbreviation: string;
  active: boolean;
  bank_account: string;
  bank_name: string;
  contract_type: any[];
  contract_type_id: number;
  created_at: string;
  date_of_eligibility: string;
  date_of_end: string;
  date_of_signature: string;
  date_of_start: string;
  description: string;
  file_id: string;
  gross_salary: string;
  id: number;
  net_salary: string;
  serial_number: string;
  updated_at: string;
  user_profile_id: number;
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

export interface UserContractItem {
  date_of_start: string;
  date_of_end: string;
  contract_type_id: number;
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
