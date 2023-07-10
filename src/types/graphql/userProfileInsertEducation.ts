import {UserProfileEducationItem} from './userProfileGetEducation';

export interface UserProfileInsertEducationResponse {
  data: {
    userProfile_Education_Insert: {
      status?: string;
      message?: string;
      item: UserProfileEducationItem;
    };
  };
}
