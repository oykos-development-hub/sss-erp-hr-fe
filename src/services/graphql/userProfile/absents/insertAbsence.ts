const insertAbsence = `mutation UserProfileAbsentInsert($data: UserProfileAbsentInsertMutation!){
    userProfileAbsent_Insert(data: $data) {
        message
        status
        item {
            id
            user_profile_id
            absent_type {
                id
                title
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
            files {
                id
                name
                type
            }
        }
    }
}`;

export default insertAbsence;
