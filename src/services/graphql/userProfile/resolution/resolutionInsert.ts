import {GraphQL} from '../..';
import {UserProfileResolutionParams} from '../../../../types/graphql/userProfileGetResolution';
import {UserProfileInsertResolutionResponse} from '../../../../types/graphql/ProfileResolutionInsert';

const resolutionInsert = async (
  data: UserProfileResolutionParams,
): Promise<UserProfileInsertResolutionResponse['data']['userProfile_Resolution_Insert']> => {
  const response = await GraphQL.fetch(`mutation {
      userProfile_Resolution_Insert(data: {
        id: ${data.id},
        user_profile_id: ${data.user_profile_id},
        resolution_purpose: "${data.resolution_purpose}",
        date_of_start: "${data.date_of_start}",
        date_of_end: "${data.date_of_end}",
        file_id: ${data.file_id},
        resolution_type_id: ${data.resolution_type_id}
      }){
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
  `);

  return response?.data?.userProfile_Resolution_Insert || {};
};

export default resolutionInsert;
