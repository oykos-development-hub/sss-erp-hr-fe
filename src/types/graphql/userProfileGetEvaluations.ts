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
  file_id: number;
};

export interface UserProfileEvaluationFormValues {
  id?: number | null;
  user_profile_id: number;
  evaluation_type_id: number;
  date_of_evaluation: Date | null;
  score: string;
  evaluator?: string;
  is_relevant: boolean;
  file_id: number;
}

export interface UserProfileEvaluationResponse {
  data: {
    userProfile_Evaluation: {
      message?: string;
      status?: string;
      items?: UserProfileEvaluation[];
    };
  };
}
