export type EvaluationType = {
  id: number;
  title: string;
};

export type UserProfileEvaluation = {
  id: number;
  user_profile_id: number;
  evaluation_type: EvaluationType;
  evaluation_type_id: number;
  date_of_evaluation: string;
  score: string;
  evaluator: string;
  is_relevant: boolean;
  created_at: string;
  updated_at: string;
  file_id: number;
};

export interface UserProfileEvaluationResponse {
  data: {
    userProfile_Evaluation: {
      message?: string;
      status?: string;
      items?: UserProfileEvaluation[];
    };
  };
}
