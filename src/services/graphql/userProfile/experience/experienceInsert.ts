import {GraphQL} from '../..';
import {UserProfileExperience} from '../../../../types/graphql/userProfileGetExperienceTypes';
import {UserProfileInsertExperienceResponse} from '../../../../types/graphql/userProfileInsertExperienceTypes';

const experienceInsert = async (
  data: UserProfileExperience,
): Promise<UserProfileInsertExperienceResponse['data']['userProfile_Experience_Insert']> => {
  const mutation = `mutation UserProfileExperienceInsert($data: UserProfileExperienceInsertMutation!){
    userProfile_Experience_Insert(data: $data) {
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
}`;

  const response = await GraphQL.fetch(mutation, {data});

  return response?.data?.userProfile_Experience_Insert || {};
};

export default experienceInsert;
