import {DropdownDataNumber, DropdownDataString} from '../dropdownData';
import {JudgeNorm} from './judgeNorms';
import {DetailsResponse, GetResponse} from './response';
export interface Judge {
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
  norms: JudgeNorm[];
}

export interface JudgesOverviewQueryParams {
  organization_unit: DropdownDataNumber | null;
  user_profile: DropdownDataNumber | null;
  page: number;
  size: number;
  search?: string;
  norm_year?: DropdownDataNumber | null;
}

export interface JudgeResolutionsItem {
  id: number;
  organization_unit_id: number;
  number_of_judges: number;
  number_of_presidents: number;
}

export interface AvailableJudgesResponse {
  checkJudgeAndPresidentIsAvailable: DetailsResponse<AvailableJudges>;
}
export interface AvailableJudges {
  judge: boolean;
  president: boolean;
}

export type JudgesResponse = {
  judges_Overview: GetResponse<Judge>;
};
