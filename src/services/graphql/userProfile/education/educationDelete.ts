import {GraphQL} from '../..';
import {UserProfileDeleteEducationResponse} from '../../../../types/graphql/userProfileDeleteEducation';

const educationDelete = async (
  id: number,
): Promise<UserProfileDeleteEducationResponse['data']['userProfile_Education_Delete']> => {
  const response = await GraphQL.fetch(`
    mutation {
      userProfile_Education_Delete(id: ${id}) {
        message
        status
      }
    }
    `);

  return response?.data?.userProfile_Education_Delete || {};
};

export default educationDelete;
