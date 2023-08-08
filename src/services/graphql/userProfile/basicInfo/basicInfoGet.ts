import {GraphQL} from '../..';
import {UserProfileBasicResponse} from '../../../../types/graphql/userProfiles';

const basicInfoGet = async (user_profile_id?: number): Promise<UserProfileBasicResponse> => {
  const query = `query($user_profile_id: Int!) {
    userProfile_Basic(user_profile_id: $user_profile_id) {
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
          housing_description
          revisor_role
          marital_status
          date_of_taking_oath
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
          contracts {
              id
              user_profile_id
              contract_type_id
              abbreviation
              description
              active
              serial_number
              net_salary
              gross_salary
              bank_account
              bank_name
              date_of_signature
              date_of_eligibility
              date_of_start
              date_of_end
              file_id
              contract_type {
                  id
                  title
                  abbreviation
                  description
                  color
                  icon
                  created_at
                  updated_at
              }
              created_at
              updated_at
          }
      }
  }
      
}`;

  const response = GraphQL.fetch(query, {user_profile_id});

  return response || {};
};

export default basicInfoGet;
