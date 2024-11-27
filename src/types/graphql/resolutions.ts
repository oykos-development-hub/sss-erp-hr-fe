import {FileItem} from '../../components/fileModalView/types';
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
  files: FileItem[];
  resolution_type: ResolutionType | null;
  is_affect: DropdownDataBoolean;
  year: number;
  value: string;
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
  date_of_start: Date;
  date_of_end?: string;
  file_id: number;
  resolution_type_id: DropdownDataNumber;
  is_affect: DropdownDataBoolean;
  year: DropdownDataNumber;
  value: string;
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
    userProfileResolution_Insert: InsertResponse<ProfileResolution>;
  };
  delete: {
    userProfileResolution_Delete: DeleteResponse;
  };
};
