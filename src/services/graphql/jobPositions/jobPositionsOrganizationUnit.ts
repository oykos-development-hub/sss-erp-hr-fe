import {GraphQL} from '..';
import {JobPositionsResponse} from '../../../types/graphql/jobPositions';

const jobPositionsOrganizationUnit = async (
  organization_unit_id?: number,
): Promise<JobPositionsResponse['data']['jobPositions']> => {
  const query = `query JobPositionsOrganizationUnit($organization_unit_id: Int){
        jobPositionsOrganizationUnit(organization_unit_id: $organization_unit_id) {
            message
            status
            items {
                id
                title
                abbreviation
                serial_number
                description
                requirements
                is_judge
                is_judge_president
                color
                icon
            }
        }
    }`;
  const response = await GraphQL.fetch(query, {organization_unit_id});

  return response?.data?.jobPositions || {};
};

export default jobPositionsOrganizationUnit;
