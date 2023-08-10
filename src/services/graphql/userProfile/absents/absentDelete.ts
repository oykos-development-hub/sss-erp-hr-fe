import {GraphQL} from '../..';
import {UserProfileAbsentsDeleteResponse} from '../../../../types/graphql/profileAbsentsDelete';

const absentDelete = async (
  id: number,
  vacation_type_id: number,
): Promise<UserProfileAbsentsDeleteResponse['data']['userProfile_Absent_Delete']> => {
  const response = await GraphQL.fetch(`mutation {
    userProfile_Absent_Delete(id: ${id}, vacation_type_id: ${vacation_type_id}) {
        message
        status
    }
}`);

  return response?.data?.userProfile_Absent_Delete || {};
};

export default absentDelete;
