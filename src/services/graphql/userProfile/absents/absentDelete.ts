import {GraphQL} from '../..';
import {UserProfileAbsentsDeleteResponse} from '../../../../types/graphql/profileAbsentsDelete';

const absentDelete = async (
  id: number,
  vacation_type_id: number,
): Promise<UserProfileAbsentsDeleteResponse['data']['userProfile_Absent_Delete']> => {
  const mutation = `mutation($id: Int!, $vacation_type_id: Int) {
    userProfile_Absent_Delete(id: $id, vacation_type_id: $vacation_type_id) {
        message
        status
    }
}`;

  const response = await GraphQL.fetch(mutation, {id, vacation_type_id});

  return response?.data?.userProfile_Absent_Delete || {};
};

export default absentDelete;
