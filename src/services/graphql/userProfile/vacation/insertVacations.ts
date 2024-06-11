const insertVacations = `mutation UserProfileVacationsInsert($data: UserProfileVacationsInsertMutation!){
    userProfileVacations_Insert(data: $data) {
        message
        status
        data
        item {
            id
            user_profile {
                id
                title
            }
            resolution_type {
                id
                title
            }
            resolution_purpose
            year
            number_of_days
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

export default insertVacations;
