export type UserProfileFamily = {
  id: number;
  user_profile_id: number;
  first_name: string;
  last_name: string;
  birth_last_name: string;
  date_of_birth: string;
  country_of_birth: string;
  city_of_birth: string;
  nationality: string;
  citizenship: string;
  address: string;
  father_name: string;
  mother_name: string;
  mother_birth_last_name: string;
  official_personal_id: string;
  gender: string;
  insurance_coverage: string;
  employee_relationship: string;
  handicapped_person: boolean;
  created_at: string;
  updated_at: string;
};

export interface UserProfileGetFamilyResponse {
  data: {
    userProfile_Family: {
      status?: string;
      message?: string;
      items?: UserProfileFamily[];
    };
  };
}
