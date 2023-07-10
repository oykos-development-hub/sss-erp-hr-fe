import {GraphQL} from '../..';
import {UserProfileDeleteResolutionResponse} from '../../../../types/graphql/userProfileDeleteResolution';

const resolutionDelete = async (
  id: number,
): Promise<UserProfileDeleteResolutionResponse['data']['userProfile_Resolution_Delete']> => {
  const response = await GraphQL.fetch(`mutation {
    userProfile_Resolution_Delete(id: ${id}) {
        message
        status
    }
}`);

  return response?.data?.userProfile_Resolution_Delete || {};
};

export default resolutionDelete;
