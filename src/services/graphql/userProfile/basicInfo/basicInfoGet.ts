import {GraphQL} from '../..';
import {UserProfileBasicResponse} from '../../../../types/graphql/userProfiles';

const basicInfoGet = async (user_profile_id: number): Promise<UserProfileBasicResponse> => {
  const query = `query UserProfileOverview($user_profile_id: Int!){
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
            bank_account
            bank_name
            official_personal_id
            personal_id
            official_personal_document_number
            official_personal_document_issuer
            gender
            single_parent
            housing_done
            housing_description
            is_president
            is_judge
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
            contract {
                id
                user_profile {
                    id
                    title
                }
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
                created_at
                updated_at
            }
        }
    }
}`;

  const response = await GraphQL.fetch(query, {user_profile_id});

  return response?.data || {};
};

export default basicInfoGet;
