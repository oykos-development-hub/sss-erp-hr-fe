import {DropdownDataNumber, DropdownDataString} from '../dropdownData';

export type UserProfileEducationItem = {
  id: number;
  user_profile_id: number;
  type_id: number;
  date_of_certification: string | null;
  price: number;
  date_of_start: string | null;
  date_of_end: string | null;
  academic_title: string;
  expertise_level: string;
  certificate_issuer: string;
  description: string;
  created_at?: string;
  updated_at?: string;
  file_id: number;
  score: string;
};

export interface UserProfileEducationFormValues {
  id: number;
  user_profile_id: number;
  type: DropdownDataNumber | null;
  date_of_certification: Date | null;
  price: number;
  title: string;
  date_of_start: Date | null;
  date_of_end: Date | null;
  academic_title: DropdownDataString | null;
  expertise_level: '';
  certificate_issuer: string;
  description: string;
  file_id: number;
  score: string;
}

export type UserProfileEducation = {
  id: number;
  abbreviation: string;
  title?: string;
  value?: string;
  score?: string;
  items?: UserProfileEducationItem[];
};

export interface UserProfileGetEducationResponse {
  data: {
    userProfile_Education: {
      status?: string;
      message?: string;
      items?: UserProfileEducation[];
    };
  };
}
