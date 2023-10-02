import {GraphQL} from '../..';
import {UserProfileGetEducationResponse} from '../../../../types/graphql/userProfileGetEducation';

const educationOverview = async (
  user_profile_id: number,
  education_type: string,
): Promise<UserProfileGetEducationResponse['data']['userProfile_Education']> => {
  const query = `query UserProfileOverview($user_profile_id: Int!, $education_type: String!){
    userProfile_Education(user_profile_id: $user_profile_id, education_type: $education_type) {
        message
        status
        items {
            id
            type {
                id
                title
            }
            user_profile_id
            date_of_certification
            price
            date_of_start
            date_of_end
            academic_title
            expertise_level
            certificate_issuer
            description
            created_at
            updated_at
            file_id
            score
        }
    }
}`;

  const response = await GraphQL.fetch(query, {user_profile_id, education_type});

  return response.data?.userProfile_Education || {};
};

export default educationOverview;
