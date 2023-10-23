import {DropdownDataNumber} from '../dropdownData';
import {JudgeResolutionsItem} from './judges';
import {DeleteResponse, GetResponse, InsertResponse} from './response';

export interface JudgeResolutionItem {
  id: number;
  organization_unit: DropdownDataNumber;
  // available_slots_presidents: number;
  // available_slots_judges: number;
  number_of_judges: number;
  number_of_presidents: number;
  real_number_of_judges: number;
  real_number_of_presidents: number;
  // number_of_employees: number;
  // number_of_relocated_judges: number;
  // number_of_suspended_judges: number;
}

export interface JudgeResolution {
  id: number;
  serial_number: string;
  available_slots_judges?: number;
  number_of_judges: number;
  active?: boolean;
  items: JudgeResolutionItem[];
}

export interface JudgeResolutionsInsertParams {
  id: number;
  active: boolean;
  serial_number: string;
  year: string;
  items: JudgeResolutionsItem[];
}

export type JudgeResolutionResponse = {
  get: {
    judgeResolutions_Overview: GetResponse<JudgeResolution>;
  };
  getCurrentNumbers: {
    organizationUintCalculateEmployeeStats: GetResponse<JudgeResolutionItem>;
  };
  insert: {
    judgeResolutions_Insert: InsertResponse<JudgeResolution>;
  };
  delete: {
    judgeResolutions_Delete: DeleteResponse;
  };
};
