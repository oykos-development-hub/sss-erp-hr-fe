import {SystematizationDetails} from './systematizationsGetDetailsTypes';

export interface SystematizationsInsertParams {
  id: number;
  user_profile_id: number;
  organization_unit_id: number;
  description: string;
  serial_number: string;
  active: boolean;
  date_of_activation: string;
  file_id: number;
}

export interface SystematizationsInsertResponse {
  data: {
    systematizations_Insert: {
      status?: string;
      message?: string;
      items: SystematizationDetails[];
    };
  };
}
