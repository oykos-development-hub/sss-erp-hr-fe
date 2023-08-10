import {GraphQL} from '../..';
import {UserProfileFamily} from '../../../../types/graphql/userProfileGetFamilyTypes';
import {UserProfileInsertFamilyResponse} from '../../../../types/graphql/userProfileInsertFamilyTypes';

const familyInsert = async (
  data: UserProfileFamily,
): Promise<UserProfileInsertFamilyResponse['data']['userProfile_Family_Insert']> => {
  const response = await GraphQL.fetch(`mutation {
    userProfile_Family_Insert(data: {
      id: ${data.id},
      user_profile_id: ${data.user_profile_id},
      first_name: "${data.first_name}",
      last_name: "${data.last_name}",
      birth_last_name: "${data.birth_last_name}",
      date_of_birth: "${data.date_of_birth}",
      country_of_birth: "${data.country_of_birth}",
      city_of_birth: "${data.city_of_birth}",
      nationality: "${data.nationality}",
      citizenship: "${data.citizenship}",
      address: "${data.address}",
      father_name: "${data.father_name}",
      mother_name: "${data.mother_name}",
      mother_birth_last_name: "${data.mother_birth_last_name}",
      official_personal_id: "${data.official_personal_id}",
      gender: "${data.gender}",
      insurance_coverage: "${data.insurance_coverage}",
      handicapped_person: ${data.handicapped_person},
      employee_relationship: "${data.employee_relationship}",
    }
    ) {
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
}`);

  return response?.data.userProfile_Family_Insert || {};
};

export default familyInsert;
