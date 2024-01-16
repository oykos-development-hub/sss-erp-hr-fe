const getExperience = `query UserProfileExperience($user_profile_id: Int){
    userProfile_Experience(user_profile_id: $user_profile_id) {
        message
        status
        items {
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
            file {
              id
              name
              type
            }
          }
      }
  }`;

export default getExperience;
