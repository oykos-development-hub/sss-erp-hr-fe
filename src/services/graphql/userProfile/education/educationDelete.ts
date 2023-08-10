import {GraphQL} from '../..';
import {UserProfileDeleteEducationResponse} from '../../../../types/graphql/userProfileDeleteEducation';

const educationDelete = async (
  id: number,
): Promise<UserProfileDeleteEducationResponse['data']['userProfile_Education_Delete']> => {
  const mutation = `
    mutation($id: Int!) {
      userProfile_Education_Delete(id: $id) {
          message
          status
      }
    }
  `;

  const response = await GraphQL.fetch(mutation, {id});

  return response?.data?.userProfile_Education_Delete || {};
};

export default educationDelete;
