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
  revisor_role: boolean;
  benefited_track: boolean;
  housing_description: string;
  marital_status: string;
  date_of_taking_oath: string;
  date_of_start: string;
  date_of_end: string;
  date_of_becoming_judge: string;
  email: string;
  phone: string;
  organization_unit_id: number;
  job_position_id: number;
  contract_type_id: number;
  national_minority: string;
  private_email: string;
  pin: string;
  organization_unit_department_id: number;
  password: string;
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
  role: string;
  organization_unit: string;
  job_position: string;
  created_at: string;
  updated_at: string;
}

export interface UserProfileResponse {
  items: UserProfile[];
  message: string;
  status: string;
  total: number;
}
