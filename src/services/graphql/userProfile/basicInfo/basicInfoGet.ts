import {GraphQL} from '../..';
import {UserProfileBasicResponse} from '../../../../types/graphql/userProfiles';

const basicInfoGet = async (id: number): Promise<UserProfileBasicResponse> => {
  const response = await GraphQL.fetch(`query {
    userProfile_Basic(user_profile_id: ${id}) {
        message
        status
        item {
          id
          first_name
          last_name
          date_of_birth
          birth_last_name
          country_of_birth
          city_of_birth
          nationality
          citizenship
          address
          father_name
          mother_name
          mother_birth_last_name
          bank_account
          bank_name
          official_personal_id
          official_personal_document_number
          official_personal_document_issuer
          gender
          single_parent
          housing_done
          revisor_role
          housing_description
          marital_status
          date_of_taking_oath
          date_of_start
          date_of_end
          date_of_becoming_judge
          email
          phone
          organization_unit {
              id
              title
          }
          job_position {
              id
              title
          }
          contract_type {
              id
              title
          }
          created_at
          updated_at
      }
    }
}`);

  return response || {};
};

export default basicInfoGet;
