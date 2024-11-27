const getRevisionTipDetails = `query RevisionTipsDetails($id: Int!){
    revisionTips_Details(id: $id) {
        message
        status
        item {
            id
            revision_id
            date_of_accept
            due_date
            date_of_reject
            date_of_execution
            recommendation
            status
            user_profile {
                id
                title
            }
            revision_priority
            end_date
            files {
              id
              name
              type
            }
            created_at
            updated_at
            responsible_person
        }
    }
 }`;

export default getRevisionTipDetails;
