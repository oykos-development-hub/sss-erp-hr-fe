import {GraphQL} from '../..';
import {UserProfileEducationItem} from '../../../../types/graphql/userProfileGetEducation';
import {UserProfileInsertEducationResponse} from '../../../../types/graphql/userProfileInsertEducation';

const educationInsert = async (
  data: UserProfileEducationItem,
): Promise<UserProfileInsertEducationResponse['data']['userProfile_Education_Insert']> => {
  const response = await GraphQL.fetch(`mutation {
    userProfile_Education_Insert(data: {
      id: ${data.id},
      user_profile_id: ${data.user_profile_id},
      education_type_id: ${data.education_type_id},
      date_of_certification: "${data.date_of_certification}",
      price: "${data.price}",
      date_of_start: "${data.date_of_start}",
      date_of_end: "${data.date_of_end}",
      academic_title: "${data.academic_title}",
      expertise_level: "${data.expertise_level}",
      certificate_issuer: "${data.certificate_issuer}",
      description: "${data.description}",
      file_id: ${data.file_id},
    }
    ) {
      message
      status
      item {
        id
        user_profile_id
        education_type_id
        date_of_certification
        price
        date_of_start
        date_of_end
        academic_title
        expertise_level
        certificate_issuer
        description
        created_at
        updated_at
        file_id
      }
    }
}`);
  return response.data.userProfile_Education_Insert || {};
};

export default educationInsert;
