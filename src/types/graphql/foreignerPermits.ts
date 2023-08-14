import {DropdownDataString} from '../dropdownData';

export interface ForeignerPermit {
  id: number;
  user_profile_id: number;
  work_permit_number: string;
  work_permit_issuer: string | null;
  work_permit_date_of_start: string;
  work_permit_date_of_end: string;
  work_permit_indefinite_length: boolean;
  residence_permit_date_of_end: string;
  residence_permit_indefinite_length: boolean;
  residence_permit_number: string;
  country_of_origin: string;
  work_permit_file_id: number;
  residence_permit_file_id: number;
}

export interface ForeignerPermitFormValues {
  id: number | null;
  user_profile_id: number | null;
  work_permit_number: string;
  work_permit_issuer: DropdownDataString | string;
  work_permit_date_of_start: string;
  work_permit_date_of_end: string;
  work_permit_indefinite_length: boolean;
  residence_permit_date_of_end: string;
  residence_permit_indefinite_length: boolean;
  residence_permit_number: string;
  country_of_origin: DropdownDataString | string;
  work_permit_file_id: number | null;
  residence_permit_file_id: number | null;
}
