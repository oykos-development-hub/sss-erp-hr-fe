const insertJobTenderApplication = `mutation($data: JobTenderApplicationInsertMutation!) {
    jobTenderApplications_Insert(data: $data) {
        message
        status
        data
        item {
            id
            active
            job_tender {
                title
                id
            }
            user_profile {
                title
                id
            }
            date_of_application
            type
            status
            first_name
            last_name
            citizenship
            date_of_birth
            date_of_application
            official_personal_document_number
            evaluation {
                id
                title
            }
            status
            created_at
            updated_at
            file_id
        }
    }
}`;

export default insertJobTenderApplication;
