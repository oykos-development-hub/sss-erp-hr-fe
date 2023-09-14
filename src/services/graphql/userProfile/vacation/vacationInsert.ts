import {GraphQL} from '../..';
import {UserProfileVacationParams, UserProfileVacationResponse} from '../../../../types/graphql/profileVacationTypes';

const vacationInsert = async (
  data: UserProfileVacationParams,
): Promise<UserProfileVacationResponse['data']['userProfile_Vacation_Insert']> => {
  const mutation = `mutation UserProfileVacationInsert($data: UserProfileVacationInsertMutation!){
    userProfile_Vacation_Insert(data: $data) {
        message
        status
        data
        item {
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

  const response = await GraphQL.fetch(mutation, {data});

  return response?.data?.userProfile_Vacation_Insert || {};
};

export default vacationInsert;
