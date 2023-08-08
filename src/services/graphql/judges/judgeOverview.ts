import {GraphQL} from '..';
import {JudgesOverviewQueryParams, JudgesOverviewResponse} from '../../../types/graphql/judges';

const judgeOverview = async (
  data: JudgesOverviewQueryParams,
): Promise<JudgesOverviewResponse['data']['judges_Overview']> => {
  const response = await GraphQL.fetch(`   
      query {
        judges_Overview(user_profile_id: ${data.user_profile_id?.id || 0}, organization_unit_id: ${
    data.organization_unit_id?.id || 0
  }, page: ${data.page}, size: ${data.size}) {
            message
            status
            total
            items {
              id
              organization_unit {
                  title
                  id
              }
              job_position {
                  title
                  id
              }
              is_judge_president
              first_name
              last_name
              created_at
              updated_at
              folder_id
              norms {
                  id
                  user_profile_id
                  topic
                  title
                  percentage_of_norm_decrease
                  number_of_norm_decrease
                  number_of_items
                  number_of_items_solved
                  evaluation_id
                  date_of_evaluation
                  date_of_evaluation_validity
                  file_id
                  relocation_id
              }
            }
        }
      }
    `);

  return response?.data?.judges_Overview || {};
};

export default judgeOverview;
