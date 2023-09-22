export type JobPositionInOrganizationUnitInsert = {
  id: number;
  systematization_id: number;
  parent_organization_unit_id: number;
  job_position_id: number;
  available_slots: number;
  employees: number[];
  requirements: string;
  description: string;
};

export type JobPositionInOrganizationUnitInsertResponse = {
  data: {
    jobPositionInOrganizationUnit_Insert: {
      status: string;
      message?: string;
      item: JobPositionInOrganizationUnitInsert;
    };
  };
};

export type JobPositionInOrganizationUnitDeleteResponse = {
  data: {
    jobPositionInOrganizationUnit_Delete: {
      status: string;
      message?: string;
    };
  };
};
