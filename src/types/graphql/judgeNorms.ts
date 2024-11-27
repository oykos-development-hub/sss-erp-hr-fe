import {DropdownDataNumber, DropdownDataString} from '../dropdownData';
import {DeleteResponse, InsertResponse} from './response';

export interface JudgeNormInsertParams {
  id: number;
  title: string;
  user_profile_id: number;
  topic: string;
  number_of_norm_decrease: number;
  number_of_items: number;
  number_of_items_solved: number;
  date_of_evaluation?: string | null;
  date_of_evaluation_validity?: string | null;
  relocation_id: number;
  file_id?: number;
  evaluation_id?: number | null;
  norm_start_date: string | null;
  norm_end_date: string | null;
}

export type JudgeNormForm = {
  id: number | null;
  title: string;
  user_profile_id: DropdownDataNumber | null;
  topic: DropdownDataString | null;
  number_of_norm_decrease: number | null;
  number_of_items: number | null;
  number_of_items_solved: number | null;
  date_of_evaluation: Date | null;
  date_of_evaluation_validity: Date | null;
  relocation_id: number | null;
  file_id?: number;
  evaluation_id?: number | null;
  norm_start_date: string;
  norm_end_date: string;
};

export interface JudgeNorm {
  id: number;
  title: string;
  user_profile_id: number;
  topic: string;
  number_of_norm_decrease: number;
  number_of_items: number;
  number_of_items_solved: number;
  evaluation?: EvaluationNorm;
  date_of_evaluation?: string;
  date_of_evaluation_validity?: string;
  relocation?: RelocationNorm;
  relocation_id: number;
  relocation_title?: string;
  full_name?: string;
  file_id?: number;
  evaluation_id?: number | null;
  norm_start_date: string;
  norm_end_date: string;
}

export interface RelocationNorm {
  id: number;
  absent_type: DropdownDataNumber;
  date_of_end: string;
  date_of_start: string;
  location: string;
}

export interface EvaluationNorm {
  id: number;
  date_of_evaluation: string;
  evaluation_type: DropdownDataNumber;
  evaluator: string;
  is_relevant: boolean;
  score: string;
}

export type JudgeNormResponse = {
  insert: {
    judgeNorms_Insert: InsertResponse<JudgeNorm>;
  };
  delete: {
    judgeNorms_Delete: DeleteResponse;
  };
};
