import {DropdownDataNumber, DropdownDataString} from '../dropdownData';
import {DropdownItemType} from './jobTenders';
import {DeleteResponse, GetResponse, InsertResponse} from './response';

export interface JobTenderApplicationInsertParams {
  active: boolean;
  citizenship?: string;
  date_of_application: string;
  date_of_birth?: string;
  first_name?: string;
  id?: number;
  job_tender_id: number;
  last_name?: string;
  official_personal_document_number?: string;
  status: string;
  type: string;
  user_profile_id?: number;
  evaluation?: string;
  number_of_assembly?: string | null;
  date_of_start?: string | null;
  date_of_election?: string | null;
  date_of_oath?: string | null;
}

export interface JobTenderApplicationsGetParams {
  page: number;
  size: number;
  id?: number;
  search?: string;
  organization_unit_id?: DropdownDataNumber | null;
  type_id?: DropdownDataNumber | null;
  job_tender_id?: number;
}

export interface JobTenderApplication {
  id: number;
  status: string;
  job_tender: DropdownItemType | null;
  organization_unit: DropdownDataNumber | null;
  tender_type: DropdownDataNumber | null;
  user_profile: DropdownItemType;
  type: 'external' | 'internal';
  first_name: string;
  last_name: string;
  official_personal_document_number: string;
  date_of_birth: string | null;
  citizenship: string;
  nationality: string;
  evaluation: DropdownDataString;
  date_of_application: string;
  created_at: string;
  updated_at: string;
  file_id: number;
}

export type JobTenderApplicationResponse = {
  get: {
    jobTender_Applications: GetResponse<JobTenderApplication>;
  };
  insert: {
    jobTenderApplications_Insert: InsertResponse<JobTenderApplication>;
  };
  delete: {
    jobTenderApplications_Delete: DeleteResponse;
  };
};
