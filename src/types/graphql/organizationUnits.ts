import {DeleteResponse, GetResponse, InsertResponse} from './response';

export interface OrganizationUnit {
  id: number;
  parent_id: number;
  number_of_judges: number;
  title: string;
  abbreviation: string;
  description?: string;
  address?: string;
  color: string;
  folder_id: number;
  icon: string;
  children?: any;
}

export type GetOrganizationUnitsParams = {
  page?: number;
  size?: number;
  search?: string;
  disable_filters?: boolean;
};

export type GetOrganizationUnitsOptions = {
  allOption?: boolean;
};

export type OrganizationUnitsResponse = {
  get: {
    organizationUnits: GetResponse<OrganizationUnit>;
  };
  insert: {
    organizationUnits_Insert: InsertResponse<OrganizationUnit>;
  };
  delete: {
    organizationUnits_Delete: DeleteResponse;
  };
};
