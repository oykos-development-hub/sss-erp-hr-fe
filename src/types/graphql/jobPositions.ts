import {DropdownDataNumber} from '../dropdownData';

export interface JobPosition {
  id?: number | null;
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

export type JobPositionEmployee = {
  id: number;
  title: string;
  user_profile_id: number;
};

export interface SystematizationJobPositions {
  available_slots: number;
  description: string;
  employees: JobPositionEmployee[];
  id: number;
  job_position: DropdownDataNumber;
  requirements: string;
  serial_number: string;
}
