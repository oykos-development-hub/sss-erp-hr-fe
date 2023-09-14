export interface YearVacationType {
  id: number;
  resolution_type: {
    id: number;
    title: string;
  };
  resolution_purpose: string;
  year: number;
  color: string;
  icon: string;
  user_profile: {
    id: number;
    title: string;
  };
  number_of_days: number;
  created_at: string;
  updated_at: string;
  file_id: number;
}

export interface VacationTypeResponse {
  data: {
    userProfile_Vacation: {
      status?: string;
      message?: string;
      total?: number;
      items: YearVacationType[];
    };
  };
}

export type UserProfileVacationParams = {
  id: number | null;
  user_profile_id: number | null;
  year: number | null;
  file_id: number | null;
  number_of_days: number | null;
  resolution_purpose: string;
};

export type UserProfileVacationResponse = {
  data: {
    userProfile_Vacation_Insert: {
      status: string;
      message?: string;
      items: UserProfileVacationParams[];
    };
  };
};

export interface UserProfileVacationDeleteResponse {
  data: {
    userProfile_Resolution_Delete: {
      status?: string;
      message?: string;
    };
  };
}
