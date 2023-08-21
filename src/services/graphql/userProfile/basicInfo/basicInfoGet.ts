import {GraphQL} from '../..';
import {UserProfileBasicResponse} from '../../../../types/graphql/userProfiles';

const basicInfoGet = async (user_profile_id: number): Promise<UserProfileBasicResponse> => {
  const query = `query($user_profile_id: Int!){
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
            national_minority
            citizenship
            address
            father_name
            mother_name
            mother_birth_last_name
            official_personal_id
            official_personal_document_number
            official_personal_document_issuer
            gender
            single_parent
            housing_done
            housing_description
            revisor_role
            marital_status
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
            contract {
              id
              contract_type {
                  id
                  title
              }
              job_position_in_organization_unit {
                  id
                  title
              }
              organization_unit {
                  id
                  title
              }
              department {
                  id
                  title
              }
              active
              date_of_start
              date_of_end
              date_of_eligibility
              file_id
            }
        }
    }
}`;

  const response = await GraphQL.fetch(query, {user_profile_id});

  return response || {};
};

export default basicInfoGet;
