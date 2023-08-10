import {GraphQL} from '..';
import {JudgesOverviewQueryParams, JudgesOverviewResponse} from '../../../types/graphql/judges';

const judgeOverview = async ({
  user_profile,
  organization_unit,
  page,
  size,
}: JudgesOverviewQueryParams): Promise<JudgesOverviewResponse['data']['judges_Overview']> => {
  const query = `query JudgesOverview($user_profile_id: Int, $organization_unit_id: Int, $page: Int, $size: Int) {
      judges_Overview(user_profile_id: $user_profile_id, organization_unit_id: $organization_unit_id, page: $page, size: $size) {
          status 
          message
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
                  evaluation {
                      id
                      date_of_evaluation
                      evaluation_type {
                          id
                          title
                      }
                      score
                      evaluator
                      is_relevant
                  }
                  date_of_evaluation_validity
                  file_id
                  relocation {
                      id
                      location
                      date_of_start
                      date_of_end
                      absent_type {
                          id
                          title
                      }
                      target_organization_unit {
                          id
                          title
                      }
                  }
              }
          }
      }
  }`;
  const organization_unit_id = organization_unit?.id && organization_unit?.id > 0 ? organization_unit?.id : undefined;
  const user_profile_id = user_profile?.id && user_profile?.id > 0 ? user_profile?.id : undefined;
  const response = await GraphQL.fetch(query, {user_profile_id, organization_unit_id, page, size});

  return response?.data?.judges_Overview || {};
};

export default judgeOverview;
