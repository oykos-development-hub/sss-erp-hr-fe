const insertResolution = `mutation UserProfileResolutionInsert($data: UserProfileResolutionInsertMutation!){
    userProfile_Resolution_Insert(data: $data) {
        message
        status
        data
        item {
            id
            user_profile {
                id
                title
            }
            is_affect
            resolution_purpose
            date_of_start
            date_of_end
            created_at
            updated_at
            file {
              id
              name
              type
            }
            resolution_type {
                id
                title
            }
        }
    }
}
  `;

export default insertResolution;
