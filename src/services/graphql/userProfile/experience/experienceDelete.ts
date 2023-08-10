import {GraphQL} from '../..';
import {UserProfileDeleteExperienceResponse} from '../../../../types/graphql/userProfileDeleteExperienceTypes';

const experienceDelete = async (
  id: number,
): Promise<UserProfileDeleteExperienceResponse['data']['userProfile_Experience_Delete']> => {
  const mutation = `mutation($id: Int!) {
    userProfile_Experience_Delete(id: $id) {
        message
        status
      }
  }`;

  const response = await GraphQL.fetch(mutation, {id});

  return response.data.userProfile_Experience_Delete || {};
};

export default experienceDelete;
