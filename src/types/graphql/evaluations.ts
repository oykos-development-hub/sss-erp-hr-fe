import {FileItem} from '../../components/fileModalView/types';
import {DropdownDataNumber, DropdownDataString} from '../dropdownData';
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
  file: FileItem;
};

export type ProfileEvaluationParams = {
  date_of_evaluation: string | null;
  evaluation_type_id: number;
  reason_for_evaluation?: string | null;
  evaluation_period?: string;
  decision_number?: string;
  id: number;
  is_relevant: boolean;
  user_profile_id: number;
  file_id?: number;
};

export interface ProfileEvaluationFormValues {
  id?: number | null;
  user_profile_id: number;
  evaluation_type_id: DropdownDataNumber | null;
  date_of_evaluation: Date | null;
  is_relevant: DropdownDataString | null;
  reason_for_evaluation?: {
    id?: number;
    title?: string;
  };
  evaluation_period?: string;
  decision_number?: string;
  file_id?: number;
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
