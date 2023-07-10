export type UserProfileResolutionItem = {
  id: number;
  user_profile_id?: number;
  resolution_purpose: string;
  date_of_start: string;
  date_of_end?: string;
  created_at?: string;
  updated_at?: string;
  file_id: number;
  resolution_type: ResolutionType | null;
};

export type UserProfileResolutionParams = {
  id: number;
  user_profile_id?: number;
  resolution_purpose: string;
  date_of_start: string;
  date_of_end?: string;
  file_id: number;
  resolution_type_id: number;
};

export type ResolutionType = {
  id: number;
  title: string;
};

export type UserProfileResolutionItemResponse = {
  data: {
    userProfile_Resolution: {
      status?: string;
      message?: string;
      items?: UserProfileResolutionItem[];
    };
  };
};
