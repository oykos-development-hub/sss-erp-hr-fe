import {GraphQL} from '..';
import {OrganizationUintCalculateEmployeeStatsResponse} from '../../../types/graphql/judges';

const getOrganizationUnitRealJudgeNumberData = async (): Promise<
  OrganizationUintCalculateEmployeeStatsResponse['data']['organizationUintCalculateEmployeeStats']
> => {
  const response = await GraphQL.fetch(`   
    query OrganizationUintCalculateEmployeeStats {
      organizationUintCalculateEmployeeStats {
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
  }
`);

  return response?.data?.organizationUintCalculateEmployeeStats || {};
};

export default getOrganizationUnitRealJudgeNumberData;
