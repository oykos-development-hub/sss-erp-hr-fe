import {GraphQL} from '..';
import {
  EmployeeInOrganizationUnitInsert,
  EmployeeInOrganizationUnitInsertResponse,
} from '../../../types/graphql/employeeInOrganizationUnitTypes';

const employeeInOrganizationUnitInsert = async (
  data: EmployeeInOrganizationUnitInsert,
): Promise<EmployeeInOrganizationUnitInsertResponse['data']['employeeInOrganizationUnit_Insert']> => {
  const response = await GraphQL.fetch(`mutation {
    employeeInOrganizationUnit_Insert(data: {
      id: ${data.id},
      user_profile_id: ${data.user_profile_id},
      position_in_organization_unit_id: ${data.position_in_organization_unit_id},
      active: ${data.active},
    }
    ) {
      message
      status
      item {
        id
        user_account_id
        position_in_organization_unit_id
        active
        created_at
        updated_at
        }
  }
}`);

  return response?.data?.employeeInOrganizationUnit_Insert || {};
};

export default employeeInOrganizationUnitInsert;
