import {GraphQL} from '..';
import {OrganizationUnitDeleteResponse} from '../../../types/graphql/organizationUnitsTypes';

const organizationUnitDelete = async (
  id: number,
): Promise<OrganizationUnitDeleteResponse['data']['organizationUnits_Delete']> => {
  const response = await GraphQL.fetch(`
    mutation {
        organizationUnits_Delete(id: ${id}) {
        message
        status
      }
    }
    `);

  return response?.data?.organizationUnits_Delete || {};
};

export default organizationUnitDelete;
