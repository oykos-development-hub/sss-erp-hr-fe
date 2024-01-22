const getRevisionTipDetails = `query RevisionTipsDetails($id: Int!){
    revision_tips_Details(id: $id) {
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
            documents
            reasons_for_non_executing
            user_profile {
                id
                title
            }
            revision_priority
            end_date
            file {
              id
              name
              type
            }
            created_at
            updated_at
            responsible_person
            new_due_date 
            new_date_of_execution
        }
    }
 }`;

export default getRevisionTipDetails;
