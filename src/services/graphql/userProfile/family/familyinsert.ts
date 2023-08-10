import {GraphQL} from '../..';
import {UserProfileFamily} from '../../../../types/graphql/userProfileGetFamilyTypes';
import {UserProfileInsertFamilyResponse} from '../../../../types/graphql/userProfileInsertFamilyTypes';

const familyInsert = async (
  data: UserProfileFamily,
): Promise<UserProfileInsertFamilyResponse['data']['userProfile_Family_Insert']> => {
  const mutation = `mutation UserProfileFamilyInsert($data: UserProfileFamilyInsertMutation!){
    userProfile_Family_Insert(data: $data) {
        message
        status
        item {
            id
            user_profile_id
            first_name
            last_name
            birth_last_name
            date_of_birth
            country_of_birth
            city_of_birth
            nationality
            citizenship
            address
            father_name
            mother_name
            mother_birth_last_name
            official_personal_id
            gender
            insurance_coverage
            handicapped_person
            employee_relationship
            created_at
            updated_at
        }
    }
}`;

  const response = await GraphQL.fetch(mutation, {data});

  return response?.data.userProfile_Family_Insert || {};
};

export default familyInsert;
