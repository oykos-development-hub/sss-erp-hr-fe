export type UserProfileEducationItem = {
  id: number;
  user_profile_id: number;
  education_type_id: number;
  date_of_certification: string;
  price: number;
  date_of_start: string;
  date_of_end: string;
  academic_title: string;
  expertise_level: string;
  certificate_issuer: string;
  description: string;
  created_at: string;
  updated_at: string;
  file_id: string;
};

export type UserProfileEducation = {
  id: number;
  abbreviation: string;
  title?: string;
  value?: string;
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
