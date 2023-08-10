import {UserProfileResolutionItemResponse} from '../../../../types/graphql/userProfileGetResolution';
import {GraphQL} from '../../index';

const ProfileResolutionGet = async (
  user_profile_id: number,
): Promise<UserProfileResolutionItemResponse['data']['userProfile_Resolution']> => {
  const query = `query UserProfileResolution($user_profile_id: Int){
    userProfile_Resolution(user_profile_id: $user_profile_id) {
        message
        status
        items {
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
}`;

  const response = await GraphQL.fetch(query, {user_profile_id});

  return response.data?.userProfile_Resolution || {};
};

export default ProfileResolutionGet;
