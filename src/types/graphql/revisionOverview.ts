import {DropdownDataNumber} from '../dropdownData';

export type RevisionItem = {
  id: number;
  title: string;
  year: string;
  plan_id: number;
  serial_number: string;
  date_of_revision: string;
  revision_quartal: string;
  internal_revision_subject: DropdownDataNumber | null;
  external_revision_subject: DropdownDataNumber | null;
  revisor: DropdownDataNumber | null;
  revision_type: DropdownDataNumber | null;
  file_id: number;
  created_at: string;
  updated_at: string;
};

export type RevisionParams = {
  page: number;
  size: number;
  plan_id: number;
  internal_revision_subject_id: number;
  revision_type_id: number;
  revisor_id: number;
};

export type Revisors = {
  title: string;
  id: number;
};

export type RevisionResponse = {
  data: {
    revision_Overview: {
      message?: string;
      status?: string;
      total?: number;
      revisors?: Revisors[];
      items: RevisionItem[];
    };
    revision_Details: {
      message: string;
      status: string;
      revisors: Revisors[];
      items: RevisionItem;
    };
  };
};
