export type JobPositionInOrganizationUnitInsert = {
  id: number;
  systematization_id: number;
  parent_organization_unit_id: number;
  job_position_id: number;
  parent_job_position_id: number;
  system_permission_id: number;
  available_slots: number;
  description: string;
  serial_number: string;
  requirements: string;
  icon: string;
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
