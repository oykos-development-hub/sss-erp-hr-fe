const insertForeignerPermit = `mutation UserProfileForeignerInsert($data: UserProfileForeignerInsertMutation!){
    userProfileForeigner_Insert(data: $data) {
        message
        data
        status
        item {
            id
            user_profile_id
            work_permit_number
            work_permit_issuer
            work_permit_date_of_start
            work_permit_date_of_end
            work_permit_indefinite_length
            residence_permit_date_of_end
            residence_permit_indefinite_length
            residence_permit_number
            country_of_origin
            created_at
            updated_at
            work_permit_file_id
            residence_permit_file_id
        }
    }
}`;

export default insertForeignerPermit;
