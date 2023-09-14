import {GraphQL} from '../..';
import {UserProfileAbsentsDeleteResponse} from '../../../../types/graphql/profileAbsentsDelete';

const absentDelete = async (
  id: number,
): Promise<UserProfileAbsentsDeleteResponse['data']['userProfile_Absent_Delete']> => {
  const mutation = `mutation($id: Int!) {
    userProfile_Absent_Delete(id: $id) {
      message
      status
    }
}`;

  const response = await GraphQL.fetch(mutation, {id});

  return response?.data?.userProfile_Absent_Delete || {};
};

export default absentDelete;
