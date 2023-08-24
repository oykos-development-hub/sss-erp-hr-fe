import {ModalProps} from '../../screens/employees/education/types';
import {OrganizationUnit} from './organizationUnitsTypes';

import {JobTenderType} from './useJobTendersTypes';

export interface DropdownItemType {
  id: number;
  title: string;
}

export interface JobTender {
  id: number;
  organization_unit_id: number;
  type?: DropdownItemType;
  description: string;
  serial_number: string;
  date_of_start: string;
  date_of_end: string;
  created_at?: string;
  updated_at?: string;
  file_id: number;
  job_position?: DropdownItemType;
}

export interface JobTenderParams {
  id: number;
  organization_unit_id: number;
  type?: DropdownItemType;
  description: string;
  serial_number: string;
  date_of_start: string;
  date_of_end: string;
  created_at?: string;
  updated_at?: string;
  file_id: number;
}

export interface JobTendersModal extends ModalProps {
  dropdownJobTenderType: JobTenderType[];
  organizationUnitsList: OrganizationUnit[];
  onClose: () => void;
  refetch: () => void;
  alert: any;
}

export interface JobTenderApplication {
  id?: number;
  status: string;
  job_tender?: DropdownItemType | null;
  user_profile?: DropdownItemType | null;
  type: 'external' | 'internal';
  first_name?: string;
  last_name?: string;
  official_personal_id?: string;
  date_of_birth?: string;
  nationality?: string;
  evaluation?: string;
  date_of_application: string;
  created_at?: string;
  updated_at?: string;
  file_id?: number;
}

export interface JobTenderApplicationInsertParams
  extends Omit<JobTenderApplication, 'job_tender' | 'user_profile' | 'create_at' | 'updated_at'> {
  job_tender_id?: number;
  user_profile_id?: number;
  active?: boolean;
}

export interface JobTenderApplicationsParams {
  page: number;
  size: number;
  job_tender_id?: number;
  id?: number;
}

export interface JobTenderApplicationResponse {
  items: JobTenderApplication[];
  message: string;
  status: string;
  total: number;
}

export interface JobTenderApplicationResponse {
  data: {
    jobTender_Applications_Insert: {
      status: string;
      message: string;
      item: JobTenderApplication;
    };
    jobTender_Applications: {
      status: string;
      message: string;
      items: JobTenderApplication[];
      total: number;
    };
    jobTender_Applications_Delete: {
      status: string;
      message: string;
    };
  };
}

export interface JobTendersResponse {
  data: {
    jobTenders_Overview: {
      status: string;
      message: string;
      items: JobTender[];
      total: number;
    };
    jobTender_Details: {
      status: string;
      message: string;
      items: JobTender[];
    };
    jobTenders_Delete: {
      status: string;
      message: string;
    };
    jobTenders_Insert: {
      status: string;
      message: string;
      item: JobTender[];
    };
  };
}
