import {DeleteResponse, GetResponse, InsertResponse} from './response';

export interface ProfileVacation {
  id: number;
  resolution_type: {
    id: number;
    title: string;
  };
  resolution_purpose: string;
  year: number;
  color: string;
  icon: string;
  user_profile: {
    id: number;
    title: string;
  };
  number_of_days: number;
  created_at: string;
  updated_at: string;
  file: {
    id: number;
    name: string;
    type: string;
  };
}

export type ProfileVacationResponse = {
  get: {
    userProfile_Vacation: GetResponse<ProfileVacation>;
  };
  insert: {
    userProfile_Vacation_Insert: InsertResponse<ProfileVacation>;
  };
  delete: {
    userProfile_Resolution_Delete: DeleteResponse;
  };
};

export type ProfileVacationParams = {
  id: number | null;
  user_profile_id: number | null;
  year: number | null;
  file_id: number | null;
  number_of_days: number | null;
  resolution_purpose: string;
};
