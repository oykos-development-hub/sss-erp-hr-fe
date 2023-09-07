import {GraphQL} from '..';
import {jobPositionsAvailableInOrganizationUnitResponse} from '../../../types/graphql/jobPositions';

const jobPositionsAvailableOrganizationUnit = async (
  organization_unit_id?: number,
  office_unit_id?: number,
): Promise<jobPositionsAvailableInOrganizationUnitResponse['data']['jobPositionsAvailableInOrganizationUnit']> => {
  const query = `query JobPositionsAvailableInOrganizationUnit($organization_unit_id: Int, $office_unit_id: Int){
    jobPositionsAvailableInOrganizationUnit(organization_unit_id: $organization_unit_id, office_unit_id: $office_unit_id) {
        message
        status
        items {
            id
            title
        }
    }
}`;

  const response = await GraphQL.fetch(query, {organization_unit_id, office_unit_id});

  return response?.data?.jobPositionsAvailableInOrganizationUnit || {};
};

export default jobPositionsAvailableOrganizationUnit;
