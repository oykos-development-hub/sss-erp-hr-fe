import {GraphQL} from '../..';
import {UserProfileGetEducationResponse} from '../../../../types/graphql/userProfileGetEducation';

const educationOverview = async (
  user_profile_id: number,
): Promise<UserProfileGetEducationResponse['data']['userProfile_Education']> => {
  const response = await GraphQL.fetch(`query {
        userProfile_Education(user_profile_id: ${user_profile_id}) {
            message
            status
            items {
                id
                title
                value
                abbreviation
                items {
                    id
                    user_profile_id
                    education_type_id
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
                }
            }
        }
    }`);

  return response.data?.userProfile_Education || {};
};

export default educationOverview;
