import {GraphQL} from '../..';
import {UserProfileAbsentsDeleteResponse} from '../../../../types/graphql/profileAbsentsDelete';

const absentDelete = async (
  id: number,
  absent_type_id: number,
): Promise<UserProfileAbsentsDeleteResponse['data']['userProfile_Absent_Delete']> => {
  const mutation = `mutation($id: Int!, $absent_type_id: Int) {
    userProfile_Absent_Delete(id: $id, absent_type_id: $absent_type_id) {
        message
        status
    }
}`;

  const response = await GraphQL.fetch(mutation, {id, absent_type_id});

  return response?.data?.userProfile_Absent_Delete || {};
};

export default absentDelete;
