import {GraphQL} from '..';
import {JobPositionInOrganizationUnitDeleteResponse} from '../../../types/graphql/jobPositionInOrganizationUnitInsertTypes';

const jobPositionInOrganizationUnitDelete = async (
  id: number,
): Promise<JobPositionInOrganizationUnitDeleteResponse['data']['jobPositionInOrganizationUnit_Delete']> => {
  const response = await GraphQL.fetch(`mutation {
    jobPositionInOrganizationUnit_Delete(id: ${id}) {
        message
        status
    }
}`);

  return response?.data?.jobPositionInOrganizationUnit_Delete || {};
};

export default jobPositionInOrganizationUnitDelete;
