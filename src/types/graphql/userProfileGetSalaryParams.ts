export interface UserProfileGetSalaryParams {
  id: number;
  user_profile_id: number;
  benefited_track: boolean;
  without_raise: boolean;
  insurance_basis: string;
  salary_rank: string;
  daily_work_hours: string;
  weekly_work_hours: string;
  education_rank: string;
  education_naming: string;
  user_resolution_id: number;
  created_at: string;
  updated_at: string;
}

export interface UserProfileGetSalaryParamsResponse {
  data: {
    userProfile_SalaryParams: {
      status?: string;
      message?: string;
      items?: UserProfileGetSalaryParams[];
    };
  };
}
