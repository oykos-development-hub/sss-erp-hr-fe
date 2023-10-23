const getJobTenderApplications = `query JobTendersApplications($job_tender_id: Int, $id: Int, $organization_unit_id: Int, $type_id: Int  $page: Int!, $search: String, $size: Int!) {
    jobTender_Applications(job_tender_id: $job_tender_id, id: $id, organization_unit_id: $organization_unit_id, type_id: $type_id, page: $page, size: $size, search: $search) {
        message
        status
        data
        total
        items {
            id
            active
           job_tender {
                title
                id
            }
            tender_type {
                title
                id
            }
            organization_unit {
              title
              id
          }
            user_profile {
                title
                id
            }
            type
            first_name
            last_name
            official_personal_id
            date_of_birth
            citizenship
            status
            evaluation
            date_of_application
            created_at
            updated_at
            file_id
        }
    }
}`;

export default getJobTenderApplications;
