import {GraphQL} from '../..';
import {UserProfileExperience} from '../../../../types/graphql/userProfileGetExperienceTypes';
import {UserProfileInsertExperienceResponse} from '../../../../types/graphql/userProfileInsertExperienceTypes';

const experienceInsert = async (
  data: UserProfileExperience,
): Promise<UserProfileInsertExperienceResponse['data']['userProfile_Experience_Insert']> => {
  const response = await GraphQL.fetch(`mutation {
    userProfile_Experience_Insert(data: {
      id: ${data.id},
      user_profile_id: ${data.user_profile_id},
      relevant: ${data.relevant},
      organization_unit: "${data.organization_unit}",
      organization_unit_id: ${data.organization_unit_id},
      amount_of_experience: ${data.amount_of_experience},
      amount_of_insured_experience: ${data.amount_of_insured_experience},
      date_of_signature: "${data.date_of_signature}",
      date_of_start: "${data.date_of_start}",
      date_of_end: "${data.date_of_end}",
      reference_file_id: ${data.reference_file_id},
    }
    ) {
      message
      status
      item {
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

  return response?.data?.userProfile_Experience_Insert || {};
};

export default experienceInsert;
