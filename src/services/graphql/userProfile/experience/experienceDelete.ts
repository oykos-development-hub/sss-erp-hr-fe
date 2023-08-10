import {GraphQL} from '../..';
import {UserProfileDeleteExperienceResponse} from '../../../../types/graphql/userProfileDeleteExperienceTypes';

const experienceDelete = async (
  id: number,
): Promise<UserProfileDeleteExperienceResponse['data']['userProfile_Experience_Delete']> => {
  const response = await GraphQL.fetch(`mutation {
    userProfile_Experience_Delete(id: ${id}) {
        message
        status
    }
}`);

  return response.data.userProfile_Experience_Delete || {};
};

export default experienceDelete;
