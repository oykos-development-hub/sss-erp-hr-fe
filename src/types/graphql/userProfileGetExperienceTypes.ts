export type UserProfileExperience = {
  amount_of_experience: number;
  amount_of_insured_experience: number;
  created_at: string;
  date_of_end: string;
  date_of_signature: string;
  date_of_start: string;
  id: number;
  organization_unit: string;
  organization_unit_id: number;
  reference_file_id: number;
  relevant: boolean;
  updated_at: string;
  user_profile_id: number;
};

export interface UserProfileGetExperienceResponse {
  data: {
    userProfile_Experience: {
      status?: string;
      message?: string;
      items?: UserProfileExperience[];
    };
  };
}
