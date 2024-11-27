const getResolutions = `query UserProfileResolution($user_profile_id: Int){
    userProfile_Resolution(user_profile_id: $user_profile_id) {
        message
        status
        items {
            id
            user_profile {
                id, 
                title
            }
            is_affect
            resolution_purpose
            date_of_start
            date_of_end
            created_at
            updated_at
            value
            files {
              id
              name
              type
            }
            resolution_type {
                id
                title
            }
            year
        }
    }
}`;

export default getResolutions;
