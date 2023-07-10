import {GraphQL} from '..';
import {EmployeeInOrganizationUnitDeleteResponse} from '../../../types/graphql/employeeInOrganizationUnitTypes';

const employeeInOrganizationUnitDelete = async (
  id: number,
): Promise<EmployeeInOrganizationUnitDeleteResponse['data']['employeeInOrganizationUnit_Delete']> => {
  const response = await GraphQL.fetch(`mutation {
    employeeInOrganizationUnit_Delete(id: ${id}) {
        message
        status
    }
}`);

  return response?.data?.employeeInOrganizationUnit_Delete || {};
};

export default employeeInOrganizationUnitDelete;
