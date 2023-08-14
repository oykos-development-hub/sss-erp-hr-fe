import {GraphQL} from '..';
import {UserProfileResponse} from '../../../types/graphql/userProfiles';

const foreignerPermitOverview = async (user_profile_id: number): Promise<{data: UserProfileResponse}> => {
  const query = `query UserProfileForeigner($user_profile_id: Int!){
    userProfile_Foreigner(user_profile_id: $user_profile_id) {
        message
        status
        items {
            id
            user_profile_id
            work_permit_number
            work_permit_issuer
            work_permit_date_of_start
            work_permit_date_of_end
            work_permit_indefinite_length
            residence_permit_date_of_end
            residence_permit_indefinite_length
            residence_permit_number
            country_of_origin
            work_permit_file_id
            residence_permit_file_id
        }
    }
}`;

  const response = await GraphQL.fetch(query, {user_profile_id});

  return response?.data?.userProfile_Foreigner || {};
};

export default foreignerPermitOverview;
