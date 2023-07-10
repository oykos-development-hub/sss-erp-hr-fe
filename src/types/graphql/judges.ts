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

export interface Norms {
  id: number;
  user_profile_id: number;
  area: string;
  norm: number;
  percentage_of_norm_decrease: string;
  number_of_items: number;
  number_of_solved_items: number;
  start_date?: string;
  end_date?: string;
  evaluation?: string;
  evaluation_valid_to?: string;
  relocation?: string;
  full_name?: string;
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
  organization_unit_id: DropdownDataNumber | null;
  user_profile_id: DropdownDataNumber | null;
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
  year?: DropdownDataString | null;
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
  user_profile_id: number;
  serial_number: string;
  year: string;
  items: JudgeResolutionsItem[];
}

export interface JudgeResolutionsResponse {
  data: {
    judgeResolutions_Insert: {
      status?: string;
      message?: string;
      items?: JudgeResolutionOverview[];
    };
  };
}

export interface JudgeResolutionsItem {
  id: number;
  organization_unit_id: number;
  available_slots_presidents: number;
  available_slots_judges: number;
}

export interface JudgeResolutionsDeleteResponse {
  data: {
    judgeResolutions_Delete: {
      status?: string;
      message?: string;
    };
  };
}
