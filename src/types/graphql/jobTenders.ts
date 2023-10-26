import {ModalProps} from '../../screens/employees/education/types';
import {DropdownDataNumber} from '../dropdownData';
import {OrganizationUnit} from './organizationUnits';
import {DeleteResponse, DetailsResponse, GetResponse, InsertResponse} from './response';
import {JobTenderType} from './jobTenderTypes';

export interface DropdownItemType {
  id: number;
  title: string;
}

export interface JobTender {
  id: number;
  organization_unit_id: number;
  organization_unit?: DropdownItemType;
  type?: DropdownItemType;
  description: string;
  serial_number: string;
  date_of_start: string | null;
  date_of_end: string | null;
  created_at?: string;
  updated_at?: string;
  file_id: number;
  job_position?: DropdownItemType;
  number_of_vacant_seats: number | null;
}

export interface JobTenderParams {
  id: number;
  organization_unit_id: number;
  type?: DropdownItemType;
  description: string;
  serial_number: string;
  date_of_start: string;
  date_of_end: string | null;
  created_at?: string;
  updated_at?: string;
  file_id: number;
}

export type JobTenderForm = {
  id: number | null;
  organization_unit_id: DropdownDataNumber | null;
  type?: any;
  description: string;
  serial_number: string;
  date_of_start: Date | null;
  date_of_end: Date | null;
  file_id: number;
};

export interface JobTendersModalProps extends ModalProps {
  jobTenderTypeOptions: JobTenderType[];
  organizationUnitsList: Pick<OrganizationUnit, 'id' | 'title'>[];
  onClose: () => void;
  refetch: () => void;
  alert: any;
}

export interface ApplicationScreenFilters {
  organization_unit_id?: DropdownDataNumber;
  type_id?: DropdownDataNumber;
}

export interface JobTendersResponse {
  get: {
    jobTenders_Overview: GetResponse<JobTender>;
  };
  details: {
    jobTender_Details: DetailsResponse<JobTender>;
  };
  insert: {
    jobTenders_Insert: InsertResponse<JobTender>;
  };
  delete: {
    jobTenders_Delete: DeleteResponse;
  };
}
