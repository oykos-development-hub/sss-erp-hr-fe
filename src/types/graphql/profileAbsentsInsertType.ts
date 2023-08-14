import {DropdownDataNumber} from '../dropdownData';

export type UserProfileAbsentsItem = {
  id: number;
  user_profile_id: number;
  absent_type_id: number;
  absent_type: DropdownDataNumber;
  location?: string;
  target_organization_unit_id?: number;
  date_of_start: string;
  date_of_end: string;
  description: string;
  file_id: number;
};

export type UserProfileInsertAbsentsResponse = {
  data: {
    userProfile_Absents_Insert: {
      status: string;
      message?: string;
      items: UserProfileAbsentsItem[];
    };
  };
};
