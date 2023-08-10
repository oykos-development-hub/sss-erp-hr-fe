import {GraphQL} from '../..';
import {UserProfileGetExperienceResponse} from '../../../../types/graphql/userProfileGetExperienceTypes';

const exerienceOverview = async (
  id: number,
): Promise<UserProfileGetExperienceResponse['data']['userProfile_Experience']> => {
  const response = await GraphQL.fetch(`query {
    userProfile_Experience(user_profile_id: ${id}) {
        message
        status
        items {
          id
          user_profile_id
          relevant
          organization_unit
          organization_unit_id
          amount_of_experience
          amount_of_insured_experience
          date_of_signature
          date_of_start
          date_of_end
          created_at
          updated_at
          reference_file_id
      }
    }
}`);

  return response?.data?.userProfile_Experience || {};
};

export default exerienceOverview;
