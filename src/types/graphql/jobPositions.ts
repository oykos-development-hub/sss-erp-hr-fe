import {DropdownDataNumber} from '../dropdownData';
import {DeleteResponse, GetResponse, InsertResponse} from './response';

export type JobPositionResponse = {
  get: {
    jobPositions: GetResponse<JobPosition>;
  };
  getAvailable: {
    jobPositionsAvailableInOrganizationUnit: GetResponse<JobPosition>;
  };
};

export type JobPositionsInOrgUnitResponse = {
  get: {
    jobPositionsOrganizationUnit: GetResponse<DropdownDataNumber>;
  };
  insert: {
    jobPositionInOrganizationUnit_Insert: InsertResponse<JobPositionInOrgUnitParams>;
  };
  delete: {
    jobPositionInOrganizationUnit_Delete: DeleteResponse;
  };
};

export type JobPositionInOrgUnitParams = {
  id?: number;
  systematization_id: number;
  parent_organization_unit_id: number;
  job_position_id: number;
  available_slots: number;
};

export interface JobPosition {
  id: number;
  title: string;
  abbreviation: string;
  serial_number: number;
  description: string;
  requirements: string;
  is_judge: boolean;
  is_judge_president: boolean;
  color: string;
  icon: string;
}

export interface JobPositionsResponse {
  data: {
    jobPositions: {
      items: JobPosition[];
      message: string;
      status: string;
    };
  };
}

export interface JobPositionsOrganizationUnitResponse {
  data: {
    jobPositionsOrganizationUnit: {
      items: {id: number; title: string}[];
      message: string;
      status: string;
    };
  };
}

export interface jobPositionsAvailableInOrganizationUnitResponse {
  data: {
    jobPositionsAvailableInOrganizationUnit: {
      items: {id: number; title: string}[];
      message: string;
      status: string;
    };
  };
}

export type JobPositionEmployee = {
  id: number;
  title: string;
  user_profile_id: number;
};

export interface SystematizationJobPosition {
  available_slots: number;
  description: string;
  employees: DropdownDataNumber[];
  id: number;
  job_position: DropdownDataNumber;
  requirements: string;
  serial_number: string;
}
