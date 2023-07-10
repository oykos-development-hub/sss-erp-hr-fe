import {UserProfileEvaluation} from './userProfileGetEvaluations';

export interface UserProfileInsertEvaluationResponse {
  data: {
    userProfile_Evaluation_Insert: {
      status?: string;
      message?: string;
      item?: UserProfileEvaluation;
    };
  };
}
