import {DropdownDataBoolean, DropdownDataNumber} from '../dropdownData';
import {DeleteResponse, GetResponse, InsertResponse} from './response';

export type ProfileResolution = {
  id: number;
  user_profile_id?: number;
  resolution_purpose: string;
  date_of_start: string;
  date_of_end?: string;
  created_at?: string;
  updated_at?: string;
  file_id: number;
  resolution_type: ResolutionType | null;
  is_affect: DropdownDataBoolean;
};

export type ProfileResolutionForm = {
  id: number;
  user_profile_id: number;
  resolution_purpose: string;
  date_of_start: Date | null;
  date_of_end: Date | null;
  file_id: number;
  resolution_type: ResolutionType | null;
};

export type ProfileResolutionParams = {
  id: number;
  user_profile_id?: number;
  resolution_purpose: string;
  date_of_start: string;
  date_of_end?: string;
  file_id: number;
  resolution_type_id: number;
  is_affect: DropdownDataBoolean;
};

export type ResolutionType = {
  id: number;
  title: string;
};

export type ProfileResolutionResponse = {
  get: {
    userProfile_Resolution: GetResponse<ProfileResolution>;
  };
  insert: {
    userProfile_Resolution_Insert: InsertResponse<ProfileResolution>;
  };
  delete: {
    userProfile_Resolution_Delete: DeleteResponse;
  };
};
