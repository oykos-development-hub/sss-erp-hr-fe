import {GraphQL} from '../..';
import {UserProfileDeleteResolutionResponse} from '../../../../types/graphql/userProfileDeleteResolution';

const resolutionDelete = async (
  id: number,
): Promise<UserProfileDeleteResolutionResponse['data']['userProfile_Resolution_Delete']> => {
  const mutation = `mutation($id: Int!) {
    userProfile_Resolution_Delete(id: $id) {
        message
        status
    }
}`;

  const response = await GraphQL.fetch(mutation, {id});

  return response?.data?.userProfile_Resolution_Delete || {};
};

export default resolutionDelete;
