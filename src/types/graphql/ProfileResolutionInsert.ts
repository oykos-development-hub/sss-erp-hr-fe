export type UserProfileResolutionItem = {
  id: number;
  user_profile_id: number;
  resolution_purpose: string;
  date_of_start: string;
  date_of_end: string;
  created_at: string;
  updated_at: string;
  file_id: string;
  resolution_type: ResolutionType;
};

export type ResolutionType = {
  id: number;
  title: string;
};

export type UserProfileInsertResolutionResponse = {
  data: {
    userProfile_Resolution_Insert: {
      status: string;
      message?: string;
      items: UserProfileResolutionItem[];
    };
  };
};
