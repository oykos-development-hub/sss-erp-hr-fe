import {DropdownDataNumber} from '../dropdownData';

export type RevisionTipsItem = {
  id: number;
  revision_id: number;
  date_of_accept: string;
  due_date: number;
  date_of_reject: string;
  date_of_execution: string;
  recommendation: string;
  status: string;
  documents: string;
  reasons_for_non_executing: string;
  user_profile: DropdownDataNumber;
  file_id: number;
  created_at: string;
  updated_at: string;
  revision_priority: string;
  end_date: string;
};

export type RevisionTipsParams = {
  page: number;
  size: number;
  revision_id: number;
};

export type RevisionTipsResponse = {
  data: {
    revision_tips_Overview: {
      message: string;
      status: string;
      total: number;
      revisors: DropdownDataNumber[];
      items: RevisionTipsItem[];
    };
    revision_tips_Details: {
      message: string;
      status: string;
      total: number;
      revisors: DropdownDataNumber[];
      items: RevisionTipsItem;
    };
  };
};
