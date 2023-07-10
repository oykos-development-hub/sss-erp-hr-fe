import {GraphQL} from '..';
import {JudgesResolutionsOverviewQueryParams, JudgesResolutionsOverviewResponse} from '../../../types/graphql/judges';

const judgeResolutionOverview = async (
  data: JudgesResolutionsOverviewQueryParams,
): Promise<JudgesResolutionsOverviewResponse['data']['judgeResolutions_Overview']> => {
  const response = await GraphQL.fetch(`   
      query {
        judgeResolutions_Overview(year: "${data?.year ? data?.year : ''}", page: ${data.page}, size: ${data.size}) {
            status 
            message
            total 
            items {
                id
                serial_number
                year
                available_slots_judges
                number_of_judges
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
  }
`);

  return response?.data?.judgeResolutions_Overview || {};
};

export default judgeResolutionOverview;
