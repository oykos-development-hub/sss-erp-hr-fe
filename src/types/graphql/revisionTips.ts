import {FileItem} from '../../components/fileModalView/types';
import {DropdownDataNumber, DropdownDataString} from '../dropdownData';
import {DeleteResponse, DetailsResponse, GetResponse, InsertResponse} from './response';

export type RevisionTip = {
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
  file: FileItem;
  created_at: string;
  updated_at: string;
  revision_priority: string;
  end_date: string;
};

export type RevisionTipInsertParams = {
  id: number;
  revision_id: number;
  user_profile_id: number;
  date_of_accept: string;
  due_date: number;
  recommendation: string;
  revision_priority: string;
  end_date: string;
};

export type RevisionTipsGetParams = {
  page: number;
  size: number;
  revision_id: number;
};

export type RevisionTipsResponse = {
  get: {
    revisionTips_Overview: GetResponse<RevisionTip> & {revisors: DropdownDataNumber[]};
  };
  details: {
    revisionTips_Details: DetailsResponse<RevisionTip>;
  };
  insert: {
    revisionTips_Insert: InsertResponse<RevisionTip>;
  };
  delete: {
    revisionTips_Delete: DeleteResponse;
  };
};

export type RevisionTipForm = {
  id: number;
  responsible_person: string;
  user_profile_id: DropdownDataNumber | null;
  date_of_accept: Date | null;
  due_date: DropdownDataNumber | null;
  date_of_reject: Date | null;
  date_of_execution: Date | null;
  recommendation: string;
  revision_priority: DropdownDataString | null;
  new_due_date: DropdownDataNumber | null;
};
