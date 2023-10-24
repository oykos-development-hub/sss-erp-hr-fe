import {DropdownDataNumber} from '../dropdownData';
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
    revision_plans_Overview: GetResponse<RevisionPlan>;
  };
  details: {
    revision_plans_Details: DetailsResponse<RevisionPlan>;
  };
  insert: {
    revision_plans_Insert: InsertResponse<RevisionPlan>;
  };
  delete: {
    revision_plans_Delete: DeleteResponse;
  };
};

export type RevisionPlanForm = {
  name: string;
  year: DropdownDataNumber | null;
  id: number | null;
};
