import {GraphQL} from '../..';
import {UserProfileVacationDeleteResponse} from '../../../../types/graphql/profileVacationTypes';

const vacationDelete = async (
  id: number,
): Promise<UserProfileVacationDeleteResponse['data']['userProfile_Resolution_Delete']> => {
  const mutation = `mutation($id: Int!) {
    userProfile_Resolution_Delete(id: $id) {
        message
        status
    }
}`;

  const response = await GraphQL.fetch(mutation, {id});

  return response?.data?.userProfile_Resolution_Delete || {};
};

export default vacationDelete;
