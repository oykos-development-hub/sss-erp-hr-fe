const insertExperiences = `mutation UserProfileExperiencesInsert($data: [UserProfileExperienceInsertMutation]){
    userProfileExperiences_Insert(data: $data) {
        message
        status
        items {
            id
            user_profile_id
            relevant
            organization_unit
            organization_unit_id
            years_of_experience
            years_of_insured_experience
            months_of_experience
            months_of_insured_experience
            days_of_experience
            days_of_insured_experience
            date_of_start
            date_of_end
            created_at
            updated_at
            reference_file_id
            file {
                id
                name
                type
            }
        }
    }
}`;

export default insertExperiences;
