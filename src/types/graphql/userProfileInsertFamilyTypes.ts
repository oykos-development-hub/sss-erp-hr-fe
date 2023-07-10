import {UserProfileFamily} from './userProfileGetFamilyTypes';

export interface UserProfileInsertFamilyResponse {
  data: {
    userProfile_Family_Insert: {
      status?: string;
      message?: string;
      item: UserProfileFamily;
    };
  };
}
