import {GraphQL} from '../..';
import {UserProfileInsertAbsentsResponse} from '../../../../types/graphql/profileAbsentsInsertType';
import {UserProfileAbsentsParams} from '../../../../types/graphql/profileAbsentsTypes';

const absentInsert = async (
  data: UserProfileAbsentsParams,
): Promise<UserProfileInsertAbsentsResponse['data']['userProfile_Absents_Insert']> => {
  const response = await GraphQL.fetch(`mutation {
    userProfile_Absent_Insert(data: {
        id: ${data.id}
        user_profile_id: ${data.user_profile_id}
        vacation_type_id: ${data.vacation_type_id}
        date_of_start: "${data.date_of_start}"
        date_of_end: "${data.date_of_end}"
        description: "${data.description}"
        file_id: ${data.file_id}
        location: "${data.location}"
        target_organization_unit_id: ${data.target_organization_unit_id}
    }) {
        message
        status
        item {
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
    }
  `);

  return response?.data?.userProfile_Absent_Insert || {};
};

export default absentInsert;
