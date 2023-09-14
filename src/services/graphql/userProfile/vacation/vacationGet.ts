import {GraphQL} from '../..';
import {VacationTypeResponse} from '../../../../types/graphql/profileVacationTypes';

const GetVacation = async (user_profile_id: number): Promise<VacationTypeResponse['data']['userProfile_Vacation']> => {
  const query = `query UserProfileVacation($user_profile_id: Int){
    userProfile_Vacation(user_profile_id: $user_profile_id) {
        message
        status
        data
        items {
            id
            user_profile {
                id
                title
            }
            resolution_type {
                id
                title
            }
            resolution_purpose
            year
            number_of_days
            created_at
            updated_at
            file_id
        }
    }
}`;

  const response = await GraphQL.fetch(query, {user_profile_id});

  return response?.data?.userProfile_Vacation || {};
};

export default GetVacation;
