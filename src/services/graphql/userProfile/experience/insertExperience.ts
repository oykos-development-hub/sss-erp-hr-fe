const insertExperience = `mutation UserProfileExperienceInsert($data: UserProfileExperienceInsertMutation!){
    userProfile_Experience_Insert(data: $data) {
        message
        status
        data
        item {
            id
            user_profile_id
            relevant
            organization_unit
            organization_unit_id
            amount_of_experience
            amount_of_insured_experience
            date_of_start
            date_of_end
            created_at
            updated_at
            reference_file_id
        }
    }
}`;

export default insertExperience;
