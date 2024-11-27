const insertRevisionTip = `mutation($data: RevisionTipsInsertMutation!) {
    revisionTips_Insert(data: $data) {
        message
        status
        data
        item {
            id
            revision_id
            date_of_accept
            due_date
            date_of_reject
            date_of_execution
            recommendation
            status
            revision_priority
            end_date
            user_profile {
                id
                title
            }
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

export default insertRevisionTip;
