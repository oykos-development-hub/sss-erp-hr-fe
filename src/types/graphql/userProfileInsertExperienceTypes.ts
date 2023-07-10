import {ForeignerPermit} from './foreignerPermits';
import {UserProfileExperience} from './userProfileGetExperienceTypes';

export interface UserProfileInsertExperienceResponse {
  data: {
    userProfile_Experience_Insert: {
      status?: string;
      message?: string;
      item?: UserProfileExperience;
    };
    userProfile_Foreigner_Insert: {
      item: ForeignerPermit;
      status: string;
      message: string;
    };
  };
}
