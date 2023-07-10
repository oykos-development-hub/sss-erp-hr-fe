import {DropdownDataNumber, DropdownDataString} from '../../types/dropdownData';

export interface InternalRevisionFormValues {
  revision_type?: DropdownDataNumber | null;
  revision_type_id: number;
  revisor_user_profile?: DropdownDataNumber | null;
  revisor_user_profile_id: number;
  revision_organization_unit?: DropdownDataNumber | null;
  revision_organization_unit_id: number;
  responsible_user_profile?: DropdownDataNumber | null;
  responsible_user_profile_id: number;
  implementation_user_profile?: DropdownDataNumber | null;
  implementation_user_profile_id: number;
  title: string;
  planned_year: DropdownDataString | null;
  planned_quarter: DropdownDataString | null;
  serial_number: string;
  priority: string;
  date_of_revision: string;
  date_of_acceptance: string;
  date_of_rejection: string;
  implementation_suggestion: string;
  implementation_month_span: string;
  date_of_implementation: string;
  state_of_implementation: DropdownDataString | null;
  implementation_failed_description: string;
  second_implementation_month_span: string;
  second_date_of_revision: string;
  file_id: number;
}
