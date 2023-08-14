import {GraphQL} from '../..';
import {UserProfileGetFamilyResponse} from '../../../../types/graphql/userProfileGetFamilyTypes';

const familyOverview = async (id: number): Promise<UserProfileGetFamilyResponse['data']['userProfile_Family']> => {
  const query = `query UserProfileFamily($user_profile_id: Int){
    userProfile_Family(user_profile_id: $user_profile_id) {
        message
        status
        items {
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
            employee_relationship
            mother_birth_last_name
            official_personal_id
            gender
            insurance_coverage
            handicapped_person
            national_minority
        }
    }
}`;

  const response = await GraphQL.fetch(query, {user_profile_id: id});

  return response?.data?.userProfile_Family || {};
};

export default familyOverview;
