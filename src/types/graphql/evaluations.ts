import {DeleteResponse, GetResponse, InsertResponse} from './response';

export type EvaluationType = {
  id: number;
  title: string;
};

export type ProfileEvaluation = {
  id: number;
  user_profile_id: number;
  evaluation_type: EvaluationType;
  evaluation_type_id: number;
  date_of_evaluation: string;
  score: string;
  evaluator: string;
  is_relevant: boolean;
  file_id: number;
};

export interface ProfileEvaluationFormValues {
  id?: number | null;
  user_profile_id: number;
  evaluation_type_id: number;
  date_of_evaluation: Date | null;
  score: string;
  evaluator?: string;
  is_relevant: boolean;
  file_id: number;
}

export type ProfileEvaluationResponse = {
  get: {
    userProfile_Evaluation: GetResponse<ProfileEvaluation>;
  };
  insert: {
    userProfile_Evaluation_Insert: InsertResponse<ProfileEvaluation>;
  };
  delete: {
    userProfile_Evaluation_Delete: DeleteResponse;
  };
};
