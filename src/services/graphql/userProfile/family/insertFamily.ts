const insertFamily = `mutation UserProfileFamilyInsert($data: UserProfileFamilyInsertMutation!){
    userProfile_Family_Insert(data: $data) {
        message
        status
        data
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
        }
    }
}`;

export default insertFamily;
