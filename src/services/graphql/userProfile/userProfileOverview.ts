import {UserProfileParams, UserProfileResponse} from '../../../types/graphql/userProfiles';
import {GraphQL} from '..';

const userProfileOverview = async ({
  page,
  size,
  id = 0,
  is_active = true,
  organization_unit_id = 0,
  job_position_id = 0,
  name = '',
}: UserProfileParams): Promise<{data: UserProfileResponse}> => {
  const query = `query UserProfileOverview($id: Int, $is_active: Boolean, $organization_unit_id: Int, $job_position_id: Int, $name: String, $page: Int, $size: Int) {
    userProfiles_Overview(id: $id, is_active: $is_active, organization_unit_id: $organization_unit_id, job_position_id: $job_position_id, name: $name, page: $page, size: $size) {
          message
          status
          total
          items {
              id
              first_name
              last_name
              date_of_birth
              email
              phone
              active
              is_judge
              is_judge_president
              role {
                  id
                  title
              }
              organization_unit {
                  id
                  title
              }
              job_position {
                  id
                  title
              }
              created_at
              updated_at
          }
      }
  }`;

  const response = await GraphQL.fetch(query, {id, is_active, organization_unit_id, job_position_id, name, page, size});

  return response?.data?.userProfiles_Overview || {};
};

export default userProfileOverview;
