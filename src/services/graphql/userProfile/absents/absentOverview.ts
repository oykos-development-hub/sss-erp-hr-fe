import {GraphQL} from '../..';
import {UserProfileAbsentsResponse} from '../../../../types/graphql/profileAbsentsTypes';

const absentOverview = async (
  user_profile_id: number,
): Promise<UserProfileAbsentsResponse['data']['userProfile_Absent']> => {
  const response = await GraphQL.fetch(`query {
    userProfile_Absent(user_profile_id: ${user_profile_id}) {
        message
        status
        summary {
            current_available_days
            past_available_days
            used_days
        }
        items {
            id
            user_profile_id
            vacation_type {
                id
                title
            }
            location
            target_organization_unit {
                id
                title
            }
            date_of_start
            date_of_end
            description
            created_at
            updated_at
            file_id
        }
    }
}`);

  return response?.data?.userProfile_Absent || {};
};

export default absentOverview;
