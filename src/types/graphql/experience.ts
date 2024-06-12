import {FileItem} from '../../components/fileModalView/types';
import {DropdownDataString} from '../dropdownData';
import {DeleteResponse, GetResponse, InsertResponse} from './response';

export type ProfileExperience = {
  created_at: string;
  date_of_end: string;
  date_of_start: string;
  id: number;
  organization_unit: string;
  organization_unit_id: number;
  file: FileItem;
  relevant: boolean;
  updated_at: string;
  user_profile_id: number;
  years_of_experience: number;
  years_of_insured_experience: number;
  months_of_experience: number;
  months_of_insured_experience: number;
  days_of_experience: number;
  days_of_insured_experience: number;
};

export type ProfileExperienceFormValues = {
  amount_of_experience: number;
  amount_of_insured_experience: number;
  date_of_end: Date | null;
  date_of_start: Date | null;
  id: number | null;
  organization_unit: string;
  organization_unit_id: number;
  reference_file_id: number;
  relevant: DropdownDataString | null;
  user_profile_id: number;
};

export type ProfileExperienceResponse = {
  get: {
    userProfile_Experience: GetResponse<ProfileExperience>;
  };
  insert: {
    userProfileExperience_Insert: InsertResponse<ProfileExperience>;
  };
  delete: {
    userProfileExperience_Delete: DeleteResponse;
  };
  insertMultiple: {
    userProfileExperiences_Insert: InsertResponse<ProfileExperience[]>;
  };
};
