import {GraphQL} from '..';
import {OrganizationUintCalculateEmployeeStatsResponse} from '../../../types/graphql/judges';

const getOrganizationUnitRealJudgeNumberData = async (
  resolution_id: number | null,
  active: boolean,
): Promise<OrganizationUintCalculateEmployeeStatsResponse['data']['organizationUintCalculateEmployeeStats']> => {
  const query = ` 
  query OrganizationUintCalculateEmployeeStats($resolution_id: Int, $active: Boolean) {
    organizationUintCalculateEmployeeStats(resolution_id: $resolution_id, active: $active) {
        status
        message
        items {
            id
            organization_unit {
                title
                id
            }
            available_slots_presidents
            available_slots_judges
            number_of_judges
            number_of_presidents
            number_of_employees
            number_of_relocated_judges
            number_of_suspended_judges
        }
    }
}`;

  const response = await GraphQL.fetch(query, {resolution_id, active});

  return response?.data?.organizationUintCalculateEmployeeStats || {};
};

export default getOrganizationUnitRealJudgeNumberData;
