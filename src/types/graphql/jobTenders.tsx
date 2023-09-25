import {ModalProps} from '../../screens/employees/education/types';
import {DropdownDataNumber} from '../dropdownData';
import {OrganizationUnit} from './organizationUnitsTypes';

import {JobTenderType} from './useJobTendersTypes';

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
  number_of_vacant_seats: number;
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

export interface JobTenderApplication {
  id?: number;
  status: string;
  job_tender?: DropdownItemType | null;
  user_profile?: DropdownItemType;
  type: 'external' | 'internal';
  first_name?: string;
  last_name?: string;
  official_personal_id?: string;
  date_of_birth: string | null;
  citizenship?: string;
  nationality?: string;
  evaluation?: string;
  date_of_application: string;
  created_at?: string;
  updated_at?: string;
  file_id?: number;
}

export interface JobTenderApplicationInsertParams
  extends Omit<
    JobTenderApplication,
    'job_tender' | 'user_profile' | 'create_at' | 'updated_at' | 'date_of_birth' | 'date_of_application'
  > {
  job_tender_id?: number;
  user_profile_id?: number;
  active?: boolean;
  date_of_birth?: string | null;
  date_of_application: string | null;
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
