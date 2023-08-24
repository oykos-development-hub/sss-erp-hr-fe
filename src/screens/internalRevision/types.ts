import {DropdownDataNumber, DropdownDataString} from '../../types/dropdownData';

export interface InternalRevisionFormValues {
  revision_type?: DropdownDataNumber | null;
  revision_type_id: number | null;
  revisor_user_profile?: DropdownDataNumber | null;
  revisor_user_profile_id: number;
  internal_organization_unit_id?: DropdownDataNumber | null;
  external_organization_unit_id?: DropdownDataNumber | null;
  responsible_user_profile?: string;
  implementation_user_profile?: DropdownDataNumber | null;
  implementation_user_profile_id?: number | null;
  revision_organization_unit?: DropdownDataNumber | null;
  title: string;
  planned_year: DropdownDataString | null;
  planned_quarter: DropdownDataString | null;
  serial_number: string;
  priority: DropdownDataString | null;
  date_of_revision: string;
  date_of_acceptance: string;
  date_of_rejection: string;
  implementation_suggestion: string;
  implementation_month_span: DropdownDataString | null;
  date_of_implementation: string;
  state_of_implementation: DropdownDataString | null;
  implementation_failed_description: string;
  second_implementation_month_span: DropdownDataString | null;
  second_date_of_revision: string;
  file_id: number;
  ref_document: string;
}

export interface InternalRevisionInsertParams {
  id?: number;
  revision_type_id?: number;
  revisor_user_profile_id: number | null;
  internal_organization_unit_id: number | null;
  external_organization_unit_id: number | null;
  responsible_user_profile: string;
  implementation_user_profile_id?: number | null;
  title: string;
  planned_year: string;
  planned_quarter: string;
  serial_number: string;
  priority?: string;
  date_of_revision?: string;
  date_of_acceptance?: string;
  date_of_rejection?: string | null;
  implementation_suggestion: string;
  implementation_month_span?: string;
  date_of_implementation?: string;
  state_of_implementation?: string;
  implementation_failed_description: string;
  second_implementation_month_span?: string;
  second_date_of_revision?: string;
  file_id?: number;
  ref_document: string;
}
