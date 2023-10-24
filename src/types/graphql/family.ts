import {DropdownDataString} from '../dropdownData';
import {DeleteResponse, GetResponse, InsertResponse} from './response';

export interface ProfileFamily {
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
  father_name: string;
  mother_name: string;
  mother_birth_last_name: string;
  official_personal_id: string;
  gender: string;
  insurance_coverage: string;
  employee_relationship: string;
  handicapped_person: boolean;
  national_minority: any;
  created_at?: string;
  updated_at?: string;
  address: string;
}

export type ProfileFamilyParams = {
  id: number | null;
  user_profile_id: number;
  first_name: string;
  last_name: string;
  date_of_birth: Date | null;
  country_of_birth: DropdownDataString | null;
  city_of_birth: string | DropdownDataString | null;
  nationality: DropdownDataString | null;
  citizenship: DropdownDataString | null;
  father_name: string;
  mother_name: string;
  mother_birth_last_name: string;
  official_personal_id: string;
  gender: string;
  insurance_coverage: string;
  employee_relationship: string;
  handicapped_person: boolean;
  national_minority: DropdownDataString | null;
  address: string;
};

export type ProfileFamilyResponse = {
  get: {
    userProfile_Family: GetResponse<ProfileFamily>;
  };
  insert: {
    userProfile_Family_Insert: InsertResponse<ProfileFamily>;
  };
  delete: {
    userProfile_Family_Delete: DeleteResponse;
  };
};
