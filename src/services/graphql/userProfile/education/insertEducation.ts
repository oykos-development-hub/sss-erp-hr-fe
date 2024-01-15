const insertEducation = `mutation UserProfileEducationInsert($data: UserProfileEducationInsertMutation!){
    userProfile_Education_Insert(data: $data) {
        message
        status
        item {
            id
            user_profile_id
            type {
              id
              title
            }
            date_of_certification
            price
            date_of_start
            date_of_start
            academic_title
            expertise_level
            certificate_issuer
            description
            created_at
            updated_at
            file {
              id
              name
              type
            }
            score
        }
    }
}`;

export default insertEducation;
