import {DropdownDataNumber, DropdownDataString} from '../dropdownData';
export interface JudgeOverview {
  id: number;
  organization_unit: DropdownDataString | undefined;
  job_position: DropdownDataString | undefined;
  is_judge_president: boolean;
  first_name: string;
  last_name: string;
  evaluation: string;
  created_at: string;
  updated_at: string;
  folder_id: number;
  full_name?: string;
  relocation?: string;
  norms: Norms[];
}

export interface JudgeNormInsertParams {
  id: number;
  title: string;
  user_profile_id: number;
  topic: string;
  number_of_norm_decrease: number;
  number_of_items: number;
  number_of_items_solved: number;
  date_of_evaluation?: string;
  date_of_evaluation_validity?: string;
  relocation_id: number;
  file_id?: number;
  evaluation_id?: number;
}

export interface Norms {
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
  evaluation_id?: number;
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

export interface JudgesOverviewResponse {
  data: {
    judges_Overview: {
      status?: string;
      message?: string;
      total?: number;
      items?: JudgeOverview[];
    };
  };
}

export interface JudgesOverviewQueryParams {
  organization_unit: DropdownDataNumber | null;
  user_profile: DropdownDataNumber | null;
  page: number;
  size: number;
  search?: string;
}

export interface NormsInsertResponse {
  data: {
    judgeNorms_Insert: {
      status?: string;
      message?: string;
      item?: Norms;
    };
  };
}

export interface JudgeNormsDeleteResponse {
  data: {
    judgeNorms_Delete: {
      status?: string;
      message?: string;
    };
  };
}

export interface JudgesResolutionsOverviewQueryParams {
  page: number;
  size: number;
  year?: string;
}

export interface JudgeResolutionItem {
  id: number;
  organization_unit: DropdownDataNumber;
  available_slots_presidents: number;
  available_slots_judges: number;
  number_of_judges: number;
  number_of_presidents: number;
  number_of_employees: number;
  number_of_relocated_judges: number;
  number_of_suspended_judges: number;
}

export interface JudgeResolutionOverview {
  id: number;
  serial_number: string;
  year: string;
  available_slots_judges?: number;
  number_of_judges: number;
  items: JudgeResolutionItem[];
}

export interface JudgesResolutionsOverviewResponse {
  data: {
    judgeResolutions_Overview: {
      status?: string;
      message?: string;
      total?: number;
      items?: JudgeResolutionOverview[];
    };
  };
}

export interface JudgeResolutionsInsert {
  id: number;
  active: boolean;
  serial_number: string;
  year: string;
  items: JudgeResolutionsItem[];
}

export interface JudgeResolutionsResponse {
  data: {
    judgeResolutions_Insert: {
      status?: string;
      message?: string;
      item?: JudgeResolutionOverview;
    };
  };
}

export interface JudgeResolutionsItem {
  id: number;
  organization_unit_id: number;
  number_of_judges: number;
  number_of_presidents: number;
}

export interface JudgeResolutionsDeleteResponse {
  data: {
    judgeResolutions_Delete: {
      status?: string;
      message?: string;
    };
  };
}
