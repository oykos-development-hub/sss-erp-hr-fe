import {GraphQL} from '../..';
import {UserProfileDeleteFamilyResponse} from '../../../../types/graphql/userProfileDeleteFamilyTypes';

const familyDelete = async (
  id: number,
): Promise<UserProfileDeleteFamilyResponse['data']['userProfile_Family_Delete']> => {
  const mutation = `mutation($id: Int!) {
    userProfile_Family_Delete(id: $id) {
        message
        status
    }
  }`;

  const response = await GraphQL.fetch(mutation, {id});

  return response.data.userProfile_Family_Delete || {};
};

export default familyDelete;
