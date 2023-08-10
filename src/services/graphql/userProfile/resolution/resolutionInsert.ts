import {GraphQL} from '../..';
import {UserProfileResolutionParams} from '../../../../types/graphql/userProfileGetResolution';
import {UserProfileInsertResolutionResponse} from '../../../../types/graphql/ProfileResolutionInsert';

const resolutionInsert = async (
  data: UserProfileResolutionParams,
): Promise<UserProfileInsertResolutionResponse['data']['userProfile_Resolution_Insert']> => {
  const mutation = `mutation UserProfileResolutionInsert($data: UserProfileResolutionInsertMutation!){
    userProfile_Resolution_Insert(data: $data) {
        message
        status
        item {
            id
            user_profile_id
            resolution_purpose
            date_of_start
            date_of_end
            created_at
            updated_at
            file_id
            resolution_type {
                id
                title
            }
        }
    }
}
  `;

  const response = await GraphQL.fetch(mutation, {data});

  return response?.data?.userProfile_Resolution_Insert || {};
};

export default resolutionInsert;
