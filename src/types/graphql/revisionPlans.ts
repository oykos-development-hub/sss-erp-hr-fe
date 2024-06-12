import {DropdownDataNumber, DropdownDataString} from '../dropdownData';
import {DeleteResponse, DetailsResponse, GetResponse, InsertResponse} from './response';

export type RevisionPlan = {
  id: number;
  name: string;
  year: string;
};

export type RevisionPlansGetParams = {
  page: number;
  size: number;
};

export type RevisionPlanInsertParams = {
  name: string;
  year: string;
};

export type RevisionPlansResponse = {
  get: {
    revisionPlans_Overview: GetResponse<RevisionPlan>;
  };
  details: {
    revisionPlans_Details: DetailsResponse<RevisionPlan>;
  };
  insert: {
    revisionPlans_Insert: InsertResponse<RevisionPlan>;
  };
  delete: {
    revisionPlans_Delete: DeleteResponse;
  };
};

export type RevisionPlanForm = {
  name: string;
  year: DropdownDataString | null;
  id: number | null;
};
