import {GraphQL} from '../..';
import {UserProfileInsertAbsentsResponse} from '../../../../types/graphql/profileAbsentsInsertType';
import {UserProfileAbsentsParams} from '../../../../types/graphql/profileAbsentsTypes';

const absentInsert = async (
  data: UserProfileAbsentsParams,
): Promise<UserProfileInsertAbsentsResponse['data']['userProfile_Absents_Insert']> => {
  const mutation = `mutation UserProfileAbsentInsert($data: UserProfileAbsentInsertMutation!){
    userProfile_Absent_Insert(data: $data) {
        message
        status
        data
        item {
            id
            user_profile_id
            absent_type {
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
  `;

  const response = await GraphQL.fetch(mutation, {data});

  return response?.data?.userProfile_Absent_Insert || {};
};

export default absentInsert;
