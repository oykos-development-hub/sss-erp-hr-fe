export type EmployeeInOrganizationUnitInsert = {
  id: number;
  user_profile_id: number;
  position_in_organization_unit_id: number;
  active: boolean;
  created_at?: string;
  updated_at?: string;
};

export type EmployeeInOrganizationUnitInsertResponse = {
  data: {
    employeeInOrganizationUnit_Insert: {
      status: string;
      message?: string;
      item: EmployeeInOrganizationUnitInsert;
    };
  };
};

export type EmployeeInOrganizationUnitDeleteResponse = {
  data: {
    employeeInOrganizationUnit_Delete: {
      status: string;
      message?: string;
    };
  };
};
