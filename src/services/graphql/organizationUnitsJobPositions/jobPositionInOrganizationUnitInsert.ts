import {GraphQL} from '..';
import {
  JobPositionInOrganizationUnitInsert,
  JobPositionInOrganizationUnitInsertResponse,
} from '../../../types/graphql/jobPositionInOrganizationUnitInsertTypes';

const jobPositionInOrganizationUnitInsert = async (
  data: JobPositionInOrganizationUnitInsert,
): Promise<JobPositionInOrganizationUnitInsertResponse['data']['jobPositionInOrganizationUnit_Insert']> => {
  const mutation = `mutation($data: JobPositionInOrganizationUnitInsertMutation!) {
    jobPositionInOrganizationUnit_Insert(data: $data) {
        message
        status
        item {
            id
            systematization_id
            parent_organization_unit_id
            job_position_id
            available_slots
            requirements
            description
        }
    }
}`;
  const response = await GraphQL.fetch(mutation, {data});

  return response?.data?.jobPositionInOrganizationUnit_Insert || {};
};

export default jobPositionInOrganizationUnitInsert;
