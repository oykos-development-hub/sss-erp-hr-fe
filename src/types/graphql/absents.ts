import {DropdownDataNumber} from '../dropdownData';
import {DeleteResponse, GetResponse, InsertResponse} from './response';

export type Absence = {
  id: number;
  user_profile_id: number;
  summary: AbsenceSummary;
  absent_type: VacationType;
  location: string;
  target_organization_unit: TargetOrganizationTypes;
  date_of_start: string;
  date_of_end: string;
  description: string;
  created_at: string;
  updated_at: string;
  file_id: number;
};

export type AbsenceSummary = {
  current_available_days: number;
  past_available_days: number;
  used_days: number;
};

export type VacationType = {
  id: number;
  title: string;
  accounting_days_off: boolean;
};

export type TargetOrganizationTypes = {
  id: number;
  title: string;
};

export type AbsenceParams = {
  id: number | null;
  user_profile_id: number;
  absent_type_id: DropdownDataNumber | null;
  target_organization_unit_id: DropdownDataNumber | null;
  date_of_start: string | null;
  date_of_end: string | null;
  description: string;
  file_id: number | null;
  absent_type?: {
    id: number;
    title: string;
    accounting_days_off: boolean;
  };
  target_organization_unit?: {
    id: number;
    title: string;
  };
};

export type AbsentResponse = {
  get: {
    userProfile_Absent: GetResponse<Absence> & {summary: AbsenceSummary};
  };
  insert: {
    userProfile_Absent_Insert: InsertResponse<Absence>;
  };
  delete: {
    userProfile_Absent_Delete: DeleteResponse;
  };
};

export interface AbsenceType {
  id: number;
  title: string;
  abbreviation: string;
  accounting_days_off: boolean;
  description: string;
  color: string;
  icon: string;
}

export interface AbsenceTypeResponse {
  absentType: GetResponse<AbsenceType>;
}
