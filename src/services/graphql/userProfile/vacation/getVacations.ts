const getVacations = `query UserProfileVacation($user_profile_id: Int){
    userProfile_Vacation(user_profile_id: $user_profile_id) {
        message
        status
        data
        items {
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

export default getVacations;
