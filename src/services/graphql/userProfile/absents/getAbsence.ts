const getAbsence = `query UserProfileAbsent($user_profile_id: Int){
    userProfile_Absent(user_profile_id: $user_profile_id) {
        message
        status
        data
        summary {
            current_available_days
            past_available_days
            used_days
        }
        items {
            id
            user_profile_id
            absent_type {
                id
                title
                accounting_days_off
            }
            location
            target_organization_unit {
                id
                title
            }
            date_of_start
            date_of_end
            description
            created_at
            updated_at
            file {
                id
                name
                type
            }
        }
    }
}`;

export default getAbsence;
