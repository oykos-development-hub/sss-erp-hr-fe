import {UserProfileBasicInfo} from './userProfiles';

export interface UserProfileInsertBasicInfoResponse {
  data: {
    userProfile_Basic_Insert: {
      status?: string;
      message?: string;
      item?: UserProfileBasicInfo;
    };
    userProfile_Update: {
      status?: string;
      message?: string;
      item?: UserProfileBasicInfo;
    };
  };
}
