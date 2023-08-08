import {UserProfileParams, UserProfileResponse} from '../../../types/graphql/userProfiles';
import {GraphQL} from '..';

const userProfileOverview = async ({
  page,
  size,
  id = null,
  is_active = true,
  organization_unit_id = null,
  job_position_id = null,
  name = '',
}: UserProfileParams): Promise<{data: UserProfileResponse}> => {
  const query = `query($id: Int, $is_active: Boolean, $organization_unit_id: Int, $job_position_id: Int, $name: String, $page: Int, $size: Int) {
    userProfiles_Overview(page: $page, size: $size, id: $id, is_active: $is_active, organization_unit_id: $organization_unit_id, job_position_id: $job_position_id, name: $name) {
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
  const response = await GraphQL.fetch(query, {page, size, id, is_active, organization_unit_id, job_position_id, name});
  return response?.data?.userProfiles_Overview || {};
};

export default userProfileOverview;
