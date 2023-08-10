import {GraphQL} from '../..';
import {UserProfileEducationItem} from '../../../../types/graphql/userProfileGetEducation';
import {UserProfileInsertEducationResponse} from '../../../../types/graphql/userProfileInsertEducation';

const educationInsert = async (
  data: UserProfileEducationItem,
): Promise<UserProfileInsertEducationResponse['data']['userProfile_Education_Insert']> => {
  const mutation = `mutation UserProfileEducationInsert($data: UserProfileEducationInsertMutation!){
    userProfile_Education_Insert(data: $data) {
        message
        status
        item {
            id
            user_profile_id
            education_type_id
            date_of_certification
            price
            date_of_start
            date_of_start
            academic_title
            expertise_level
            certificate_issuer
            description
            created_at
            updated_at
            file_id
          }
      }
  }`;

  const response = await GraphQL.fetch(mutation, {data});

  return response.data.userProfile_Education_Insert || {};
};

export default educationInsert;
