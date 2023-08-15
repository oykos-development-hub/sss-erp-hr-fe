import {DropdownDataNumber} from '../dropdownData';

export interface InternalRevision {
  id: number;
  revision_type: DropdownDataNumber | null;
  revisor_user_profile: DropdownDataNumber | null;
  revision_organization_unit: DropdownDataNumber | null;
  revision_type_id: number;
  revisor_user_profile_id: number;
  revision_organization_unit_id: number;
  responsible_user_profile_id: number;
  responsible_user_profile: DropdownDataNumber | null;
  implementation_user_profile_id: number;
  implementation_user_profile: DropdownDataNumber | null;
  title: string;
  planned_year: string;
  planned_quarter: string;
  serial_number: string;
  priority: string;
  date_of_revision: string;
  date_of_acceptance: string;
  date_of_rejection: string;
  implementation_suggestion: string;
  implementation_month_span: string;
  date_of_implementation: string;
  state_of_implementation: string;
  implementation_failed_description: string;
  second_implementation_month_span: string;
  second_date_of_revision: string;
  file_id: number;
}

export interface InternalRevisionResponse {
  data: {
    revisions_Overview: {
      revisors: DropdownDataNumber[];
      items: InternalRevision[];
      message: string;
      status: string;
    };
    revision_Details: {
      message: string;
      status: string;
      item: InternalRevisionDetails;
    };
    revisions_Delete: {
      message: string;
      status: string;
    };
    revisions_Insert: {
      message: string;
      status: string;
      items: InternalRevisionDetails;
    };
  };
}

export interface InternalRevisionsParams {
  id?: number;
  organization_unit_id?: number;
  revisor_user_profile_id?: number;
  page?: number;
  size?: number;
}

export interface InternalRevisionDetails {
  id: number;
  revision_type_id: number;
  revisor_user_profile_id: number;
  revisor_user_profile: DropdownDataNumber;
  internal_organization_unit_id?: number;
  external_organization_unit_id?: number;
  responsible_user_profile_id: number;
  responsible_user_profile: string;
  implementation_user_profile_id: number;
  implementation_user_profile: string;
  title: string;
  planned_year: string;
  planned_quarter: string;
  serial_number: string;
  priority: string;
  date_of_revision: string;
  date_of_acceptance: string;
  date_of_rejection: string;
  implementation_suggestion: string;
  implementation_month_span: string;
  date_of_implementation: string;
  state_of_implementation: string;
  implementation_failed_description: string;
  second_implementation_month_span: string;
  second_date_of_revision: string;
  file_id: number;
  ref_document: string;
}
