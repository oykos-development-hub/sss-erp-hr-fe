import {UserProfileGetSalaryParams} from './userProfileGetSalaryParams';

export interface UserProfileInsertSalaryParamsResponse {
  data: {
    userProfile_SalaryParams_Insert: {
      status?: string;
      message?: string;
      item?: UserProfileGetSalaryParams;
    };
  };
}
